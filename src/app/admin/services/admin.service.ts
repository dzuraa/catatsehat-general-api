import { Injectable } from '@nestjs/common';
import { AdminRepository, Filter } from '../repositories';
import { CreateAdminDto, UpdateAdminDto } from '../dtos';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { SignInAdminDto } from 'src/app/auth/dtos';
import { AdminSearchDto } from '../dtos/search-admin.dto';
import { Prisma } from '@prisma/client';
import { pick } from 'lodash';
import { HealthPostRepository } from '@/app/healthpost/repositories';
import { HealthPostAdminSearchDto } from '../dtos/search-healthpost-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly healthPostRepository: HealthPostRepository,
  ) {}

  public paginate(paginateDto: AdminSearchDto) {
    const whereCondition: Prisma.AdminWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          name: {
            contains: paginateDto.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: paginateDto.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.adminRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        healthPost: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  public async findMany(healthPostAdminSearchDto: HealthPostAdminSearchDto) {
    const filter: Filter = {
      where: {
        type: 'KADER',
        deletedAt: null,
      },
    };

    if (healthPostAdminSearchDto.healthPostId) {
      await this.healthPostRepository.firstOrThrow({
        id: healthPostAdminSearchDto.healthPostId,
        deletedAt: null,
      });
    }

    if (healthPostAdminSearchDto.healthPostId) {
      Object.assign(filter.where || {}, {
        healthPostId: healthPostAdminSearchDto.healthPostId,
      });
    }

    if (healthPostAdminSearchDto.search) {
      Object.assign(filter.where || {}, {
        name: {
          contains: healthPostAdminSearchDto.search,
          mode: 'insensitive',
        },
      });
    }
    return await this.adminRepository.findMany(filter);
  }

  public detail(id: string) {
    try {
      return this.adminRepository.first(
        {
          id,
          deletedAt: null,
        },
        {
          healthPost: true,
        },
      );
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
    const admin = await this.adminRepository.first({
      email: createAdminDto.email,
      deletedAt: null,
    });
    if (admin) {
      throw new Error('err.email_already_exist');
    }

    if (createAdminDto.type === 'KADER' && !createAdminDto.healthPostId) {
      throw new Error('Health post is required for KADER type');
    }

    if (createAdminDto.type !== 'KADER' && createAdminDto.healthPostId) {
      throw new Error('Health post should not be provided for non-KADER type');
    }

    const data: Prisma.AdminCreateInput = {
      name: createAdminDto.name,
      email: createAdminDto.email,
      phone: createAdminDto.phone,
      type: createAdminDto.type,
      password: hashSync(createAdminDto.password, 10),
    };

    if (createAdminDto.healthPostId && createAdminDto.type === 'KADER') {
      const healthPost = await this.healthPostRepository.first({
        id: createAdminDto.healthPostId,
        deletedAt: null,
      });
      if (!healthPost) {
        throw new Error('Health post not found');
      }

      Object.assign(data, {
        healthPost: { connect: { id: createAdminDto.healthPostId } },
      });
    }
    const createdAdmin = await this.adminRepository.create(data);
    const pickedFields = ['id', 'name', 'email', 'type', 'phone'];
    if (createdAdmin.type === 'KADER') {
      pickedFields.push('healthPostId');
    }

    return pick(createdAdmin, pickedFields);
  }

  public async update(id: string, updateAdminDto: UpdateAdminDto) {
    const data: Prisma.AdminUpdateInput = {
      name: updateAdminDto.name,
      email: updateAdminDto.email,
      phone: updateAdminDto.phone,
      type: updateAdminDto.type,
    };

    if (updateAdminDto.password) {
      data.password = hashSync(updateAdminDto.password);
    }

    if (updateAdminDto.type !== 'KADER') {
      if (updateAdminDto.healthPostId) {
        throw new Error(
          'Health post should not be provided for non-KADER type',
        );
      }
      Object.assign(data, { healthPost: { disconnect: true } });
    } else {
      if (!updateAdminDto.healthPostId) {
        throw new Error('Error: Health post is required for KADER type');
      }
      Object.assign(data, {
        healthPost: {
          connect: {
            id: updateAdminDto.healthPostId,
          },
        },
      });
    }

    return this.adminRepository.update({ id }, data);
  }

  public async signUp(signUpDto: CreateAdminDto) {
    try {
      const password = hashSync(signUpDto.password, 10);
      return this.adminRepository.create({
        ...signUpDto,
        password,
      });
    } catch (error) {
      throw new Error(error.message);
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
