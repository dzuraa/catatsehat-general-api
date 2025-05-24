import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateAdminDto, UpdateAdminDto } from '@app/admin/dtos';
import { SignInAdminDto } from '@app/auth/dtos';
import { verifySync } from '@node-rs/bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.adminRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.adminRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.adminRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createAdminDto: CreateAdminDto) {
    try {
      return this.adminRepository.create(createAdminDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      return this.adminRepository.update({ id }, updateAdminDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async signIn(signInAdminDto: SignInAdminDto) {
    try {
      const admin = await this.adminRepository.firstOrThrow({
        email: signInAdminDto.email,
        deletedAt: null,
      });
      if (!admin || admin.email !== signInAdminDto.email)
        throw new Error('err.data_not_found');

      if (!verifySync(signInAdminDto.password, admin.password))
        throw new Error('err.password_not_match');

      return admin;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
