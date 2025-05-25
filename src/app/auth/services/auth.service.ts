import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Otp, Prisma, User } from '@prisma/client';
import { generateOtp } from 'src/common/functions/otp.function';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { ENV } from 'src/config/env';
import { omit, pick } from 'lodash';
import { ZenzivaService } from './zenziva.service';
import { UsersService } from '@app/users/services';
import { UserRepository } from '@app/users/repositories';
import { OtpRepository } from '@app/otp/repositories';
import {
  SignUpDto,
  SignInDto,
  AccountRegistrationDto,
  ChangePinDto,
} from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly zenzivaService: ZenzivaService,
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    token?: string;
    user: Pick<User, 'id' | 'name' | 'phone' | 'status'>;
  }> {
    const user = await this.userRepository.firstOrThrow({
      phone: signInDto.phone,
      deletedAt: null,
    });

    if (!verifySync(signInDto.pin, user.pin))
      throw new Error('err.pin_is_incorrect');

    const userResponse: Pick<User, 'id' | 'name' | 'phone' | 'status'> = pick(
      user,
      ['id', 'name', 'phone', 'status'],
    );

    if (user.status === 'INACTIVE') {
      // const otp = generateOtp();
      const otp = '123456'; // For testing purposes, use a fixed OTP
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
      const userOtp = await this.otpRepository.createOtp(
        user.id,
        otp,
        expiresAt,
      );
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          Otp: {
            connect: {
              id: userOtp.id,
            },
          },
        },
      );
      // await this.zenzivaService.sendOtpMessage(user.phone, otp);
    }

    // If the user is ACTIVE, generate the JWT token and return it
    const payload: Partial<JwtPayload> = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      as: 'USER',
    };

    const token = this.jwtService.sign(payload, {
      secret: ENV.JWT_SECRET,
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    return {
      token,
      user: userResponse,
    };
  }

  public async signUp(signUpDto: SignUpDto): Promise<{ user: User }> {
    // Hash the PIN before saving it to the database
    const pin = hashSync(signUpDto.pin, 10);

    // Check if a user with the same phone already exists
    const userWithSamePhone = await this.userRepository.any({
      where: { phone: signUpDto.phone },
    });
    if (userWithSamePhone) throw new Error('err.phone_already_exist');

    // Sign up user and save to the database
    const user = await this.userRepository.create({
      name: signUpDto.name,
      phone: signUpDto.phone,
      pin,
    });

    const userPick: Pick<User, 'id' | 'phone' | 'name'> = pick(user, [
      'id',
      'phone',
      'name',
    ]);
    return {
      user: userPick as User,
    };
  }

  public async accountRegistration(
    id: string,
    accountRegistrationDto: AccountRegistrationDto,
  ) {
    try {
      const userInput: Prisma.UserUpdateInput = {
        ...pick(accountRegistrationDto, [
          'address',
          'placeOfBirth',
          'dateOfBirth',
        ]),
      };

      // if (accountRegistrationDto.userPicture) {
      //   const userPicture = await this.filesService.upload({
      //     file: accountRegistrationDto.userPicture as string,
      //     fileName: accountRegistrationDto.identityNumber,
      //   });
      //   Object.assign(userInput, {
      //     userPicture: {
      //       connect: { id: userPicture.id },
      //     },
      //   });
      // }

      if (accountRegistrationDto.subDistrictId) {
        Object.assign(userInput, {
          subDistrict: {
            connect: { id: accountRegistrationDto.subDistrictId },
          },
        });
      }

      return this.userRepository.update({ id }, userInput);
    } catch (error) {
      throw new Error(error);
    }
  }

  async profile(user: User): Promise<{
    user: Omit<User, 'pin' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
  }> {
    const userProfile = await this.userService.detail(user.id);
    const userResponse = omit(userProfile, [
      'pin',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ]);
    return {
      user: userResponse,
    };
  }

  public async changePin(
    userId: string,
    changePinDto: ChangePinDto,
  ): Promise<{ success: boolean }> {
    const { currentPin, newPin } = changePinDto;
    const user = await this.userRepository.findUniqueOrThrow({
      id: userId,
    });

    // Verify the current password
    const isPinValid = verifySync(currentPin, user.pin);
    if (!isPinValid) {
      throw new Error('err.current_pin_is_incorrect');
    }

    // Step 3: Check if the new password is the same as the current password
    const isNewPinSame = verifySync(newPin, user.pin);
    if (isNewPinSame) {
      throw new Error('err.pin_is_same');
    }

    // Hash the new password
    const hashedNewPin = hashSync(newPin, 10);

    // Update the user's pin in the database
    await this.userRepository.update({ id: userId }, { pin: hashedNewPin });
    return {
      success: true,
    };
  }

  async verifyOtp(
    userId: string,
    otp: string,
  ): Promise<{ user: Pick<User, 'id' | 'name' | 'phone' | 'status'> }> {
    // Lookup the user by ID
    const user = await this.userRepository.firstOrThrow(
      {
        id: userId,
        deletedAt: null,
      },
      {
        Otp: true,
      },
    );

    // Find the latest OTP record for this user
    const latestOtp = await this.otpRepository.find({
      where: {
        userId: userId,
        otp: otp,
        isVerified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    if (!latestOtp || latestOtp.length === 0) {
      throw new Error('err.otp_not_match');
    }

    const otpRecord = latestOtp[0];

    // Check if OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      throw new Error('err.otp_expired');
    }

    // Update user status to ACTIVE
    await this.userRepository.update(
      { id: userId },
      {
        status: 'ACTIVE',
      },
    );

    // Mark OTP as verified and clear the OTP value
    await this.otpRepository.update(
      { id: otpRecord.id },
      {
        otp: '',
        isVerified: true,
      },
    );

    // Return user for response
    const userResponse = pick(user, ['id', 'phone', 'name', 'status']);

    return {
      user: userResponse,
    };
  }

  async resendOtp(user: User): Promise<{
    user: Pick<User, 'id' | 'name' | 'phone' | 'status'>;
    otpData: Otp;
  }> {
    // Generate new OTP
    const otp = generateOtp();
    // const otp = '123456';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Find existing OTP record for this user
    const existingOtp = await this.otpRepository.find({
      where: {
        userId: user.id,
        isVerified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    let otpData: Otp;

    if (!existingOtp || existingOtp.length === 0) {
      // Create new OTP record if none exists
      otpData = await this.otpRepository.create({
        data: {
          otp: otp,
          expiresAt: expiresAt,
          userId: user.id, // Link to user
          isVerified: false,
        },
      });
    } else {
      // Update existing OTP record
      otpData = await this.otpRepository.update(
        {
          id: existingOtp[0].id, // Use the OTP record ID, not user ID
        },
        {
          otp: otp,
          expiresAt: expiresAt,
          isVerified: false,
        },
      );
    }

    // Send OTP using Zenziva API
    await this.zenzivaService.sendOtpMessage(user.phone, otp);

    const userResponse = pick(user, ['id', 'name', 'phone', 'status']);

    return {
      user: userResponse,
      otpData,
    };
  }
}
