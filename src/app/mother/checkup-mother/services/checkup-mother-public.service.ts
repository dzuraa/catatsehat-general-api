import { Injectable } from '@nestjs/common';
import { BMIStatus, CheckupStatus, OwnerType, Prisma } from '@prisma/client';
// import { AdminRepository } from 'src/app/admin/repositories';
// import { FilesService } from '@src/app/files/services';
// import { HealthPostsRepository } from '@src/app/healthposts/repositories';
// import { BMI_RANGES_MOTHER } from '@src/common/constants/bmi.constant';
import { HealthPostRepository } from '@/app/healthpost/repositories';
import { BMI_RANGES_MOTHER } from '@/common/constants/bmi.constant';
import { MotherRepository } from '../../mother/repositories';
import { CreateCheckupMothersPublicDto } from '../dtos';
import { CheckupMotherSearchDto } from '../dtos/search-checkup-mother.dto';
import { CheckupMotherRepository } from '../repositories';

@Injectable()
export class CheckupMothersPublicService {
  constructor(
    private readonly checkupMotherRepository: CheckupMotherRepository,
    // private readonly filesService: FilesService,
    private readonly motherRepository: MotherRepository,
    private readonly healthPostRepository: HealthPostRepository,
    // private readonly adminRepository: AdminRepository,
  ) {}

  public paginate(paginateDto: CheckupMotherSearchDto, motherId: string) {
    const whereCondition: Prisma.CheckupMotherWhereInput = {
      deletedAt: null,
      motherId,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          mother: {
            name: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        },
        {
          healthPost: {
            name: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        },
        {
          admin: {
            name: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }
    return this.checkupMotherRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        healthPost: true,
        admin: true,
        fileDiagnosed: true,
      },
    });
  }
  public detail(id: string) {
    try {
      return this.checkupMotherRepository.firstOrThrow(
        {
          id,
          deletedAt: null,
        },
        {
          admin: true,
          healthPost: true,
          fileDiagnosed: true,
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public getBMIStatus(bmi: number): BMIStatus {
    const bmiRange = BMI_RANGES_MOTHER.find(
      (range) => bmi >= range.min && bmi <= range.max,
    );

    if (!bmiRange) {
      throw new Error('BMI range not found');
    }
    return bmiRange.status;
  }

  public async create(
    createCheckupMothersAdminDto: CreateCheckupMothersPublicDto,
  ) {
    const bmi = this.calculateBmi(
      createCheckupMothersAdminDto.height,
      createCheckupMothersAdminDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi);

    const data: Prisma.CheckupMotherCreateInput = {
      location: createCheckupMothersAdminDto.location,
      publicStaff: createCheckupMothersAdminDto.publicStaff,
      month: createCheckupMothersAdminDto.month,
      height: createCheckupMothersAdminDto.height,
      weight: createCheckupMothersAdminDto.weight,
      upperArmCircumference: createCheckupMothersAdminDto.upperArmCircumference,
      fundusMeasurement: createCheckupMothersAdminDto.fundusMeasurement,
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
      type: OwnerType.PUBLIC,
      mother: {
        connect: {
          id: createCheckupMothersAdminDto.motherId,
        },
      },
    };

    if (createCheckupMothersAdminDto.motherId) {
      const parent = await this.motherRepository.first({
        id: createCheckupMothersAdminDto.motherId,
      });
      if (!parent) {
        throw new Error('Parent not found');
      }

      Object.assign(data, {
        mother: {
          connect: {
            id: createCheckupMothersAdminDto.motherId,
          },
        },
      });
    }

    // if (createCheckupMothersAdminDto.fileDiagnosed) {
    //   const fileDiagnosed = await this.filesService.upload({
    //     file: createCheckupMothersAdminDto.fileDiagnosed,
    //     fileName: createCheckupMothersAdminDto.name ?? '',
    //   });

    //   data.status = CheckupStatus.VERIFIED;
    //   Object.assign(data, {
    //     fileDiagnosed: {
    //       connect: {
    //         id: fileDiagnosed.id,
    //       },
    //     },
    //   });
    // }
    return await this.checkupMotherRepository.create(data);
  }

  public countMothers(userId: string) {
    return this.checkupMotherRepository.count({
      where: {
        id: {},
        mother: {
          userId: userId,
        },
        deletedAt: null,
      },
    });
  }
}
