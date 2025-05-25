import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/client';
import { AdminRole } from 'src/common/enums/admin-role';
import { ENV } from 'src/config/env';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { omit } from 'lodash';
import { AdminService } from '@app/admin/services';
import { AdminRepository } from '@app/admin/repositories';
import { JwtPayload } from '../types';
import { SignInAdminDto, RequestOtpDto, ResetPassDto } from '../dtos';
// import { generateOtp } from '@src/common/functions/otp.function';
import { ZenzivaService } from './zenziva.service';
import { OtpRepository } from '@app/otp/repositories';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    private readonly zenzivaService: ZenzivaService,
    private readonly otpRepository: OtpRepository,
  ) {}

  async signIn(signInAdminDto: SignInAdminDto): Promise<{
    token: string;
    admin: Omit<Admin, 'password' | 'deletedAt' | 'createdAt' | 'updatedAt'>;
  }> {
    const admin = await this.adminService.signIn(signInAdminDto);
    if (!verifySync(signInAdminDto.password, admin.password))
      throw new Error('Password is incorrect');

    const payload: Partial<JwtPayload> = {
      email: admin.email,
      id: admin.id,
      name: admin.name,
      as: 'ADMIN',
    };

    if (admin.type === 'SUPER_ADMIN') {
      payload.type = AdminRole.SUPER_ADMIN;
    }
    if (admin.type === 'KADER') {
      payload.type = AdminRole.KADER;
    }

    const token = this.jwtService.sign(payload, {
      secret: ENV.JWT_SECRET,
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    const adminResponse: Omit<
      Admin,
      'password' | 'deletedAt' | 'createdAt' | 'updatedAt'
    > = omit(admin, ['password', 'deletedAt', 'createdAt', 'updatedAt']);

    return {
      token,
      admin: adminResponse,
    };
  }

  async profile(admin: Admin): Promise<Admin> {
    return this.adminService.detail(admin.id);
  }

  //Forgot password logic
  async requestForgotPasswordOtp(requestOtpDto: RequestOtpDto) {
    const { phone } = requestOtpDto;

    const admin = await this.adminRepository.first({
      phone,
      deletedAt: null,
    });
    if (!admin) {
      throw new Error('Admin data not found with the provided phone number');
    }

    // Generate OTP
    // const otp = generateOtp();
    const otp = '123456';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
    await this.otpRepository.create({
      data: {
        adminId: admin.id,
        otp,
        expiresAt,
      },
    });

    // Send OTP using Zensiva API
    // await this.zenivaService.sendOtpMessage(admin.phone ?? '', otp);
  }

  async resendForgotPasswordOtp(requestOtpDto: RequestOtpDto) {
    const { phone } = requestOtpDto;

    const admin = await this.adminRepository.first({
      phone,
      deletedAt: null,
    });
    if (!admin) {
      throw new Error('Admin data not found with the provided phone number');
    }

    //Generate OTP
    // const otp = generateOtp();
    const otp = '123456';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Find existing otp
    const existingOtp = await this.otpRepository.find({
      where: {
        adminId: admin.id,
        isVerified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    // Update otp record
    await this.otpRepository.update(
      {
        id: existingOtp[0].id,
      },
      {
        otp,
        isVerified: false,
        expiresAt,
      },
    );

    // Send OTP using Zensiva API
    // await this.zensivaService.sendOtpMessage(admin.phone ?? '', otp);
  }

  async resetPassword(resetPassDto: ResetPassDto) {
    const { phone, otp, newPassword } = resetPassDto;

    // Check if admin exist
    const admin = await this.adminRepository.first({
      phone,
      deletedAt: null,
    });
    if (!admin) {
      throw new Error('Admin data not found with the provided phone number');
    }

    // Verify OTP
    const latestOtp = await this.otpRepository.find({
      where: {
        adminId: admin.id,
        otp,
        isVerified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    if (!latestOtp || latestOtp.length === 0) {
      throw new Error('Otp not found or already verified');
    }

    const otpRecord = latestOtp[0];

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      throw new Error('Otp has expired');
    }

    // Reset pin
    const hashedNewPassword = hashSync(newPassword, 10);

    await this.adminRepository.update(
      {
        id: admin.id,
      },
      {
        password: hashedNewPassword,
      },
    );

    // Mark otp as verified
    await this.otpRepository.update(
      { id: otpRecord.id },
      {
        otp: '',
        isVerified: true,
      },
    );
  }
}
