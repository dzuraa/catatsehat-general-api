import { Injectable } from '@nestjs/common';
import {
  Admin,
  BMIStatus,
  CheckupStatus,
  OwnerType,
  Prisma,
} from '@prisma/client';
import { AdminRepository } from 'src/app/admin/repositories';
// import { FilesService } from '@src/app/files/services';
// import { HealthPostsRepository } from '@src/app/healthposts/repositories';
import { HealthPostRepository } from '@/app/healthpost/repositories';
import { BMI_RANGES_MOTHER } from 'src/common/constants/bmi.constant';
import { MotherRepository } from '../../mother/repositories';
import { CreateCheckupMothersAdminDto, UpdateCheckupMotherDto } from '../dtos';
import { CheckupMotherSearchDto } from '../dtos/search-checkup-mother.dto';
import { CheckupMotherRepository } from '../repositories';
@Injectable()
export class CheckupMothersAdminService {
  constructor(
    private readonly checkupMotherRepository: CheckupMotherRepository,
    // private readonly filesService: FilesService,
    private readonly healthPostRepository: HealthPostRepository,
    private readonly adminRepository: AdminRepository,
    private readonly motherRepository: MotherRepository,
  ) {}

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

  public paginate(paginateDto: CheckupMotherSearchDto) {
    const whereCondition: Prisma.CheckupMotherWhereInput = {
      deletedAt: null,
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

  public async destroy(id: string) {
    try {
      return this.checkupMotherRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createCheckupMothersAdminDto: CreateCheckupMothersAdminDto,
    admin: Admin,
  ) {
    const bmi = this.calculateBmi(
      createCheckupMothersAdminDto.height,
      createCheckupMothersAdminDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi);

    const data: Prisma.CheckupMotherCreateInput = {
      month: createCheckupMothersAdminDto.month,
      height: createCheckupMothersAdminDto.height,
      weight: createCheckupMothersAdminDto.weight,
      upperArmCircumference: createCheckupMothersAdminDto.upperArmCircumference,
      fundusMeasurement: createCheckupMothersAdminDto.fundusMeasurement,
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
      type: OwnerType.ADMIN,
      mother: {
        connect: {
          id: createCheckupMothersAdminDto.motherId,
        },
      },
    };

    Object.assign(data, {
      admin: {
        connect: {
          id: admin.id,
        },
      },
    });

    if (createCheckupMothersAdminDto.healthPostId) {
      const healthPost = await this.healthPostRepository.first({
        id: createCheckupMothersAdminDto.healthPostId,
      });
      if (!healthPost) {
        throw new Error('Health Post not found');
      }
      Object.assign(data, {
        healthPost: {
          connect: {
            id: createCheckupMothersAdminDto.healthPostId,
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

  public async update(
    id: string,
    updateCheckupMothersAdminDto: UpdateCheckupMotherDto,
  ) {
    try {
      let bmi: number | undefined;
      let bmiStatus: BMIStatus | undefined;
      if (
        updateCheckupMothersAdminDto.height &&
        updateCheckupMothersAdminDto.weight
      ) {
        bmi = this.calculateBmi(
          updateCheckupMothersAdminDto.height as number,
          updateCheckupMothersAdminDto.weight as number,
        );
        bmiStatus = this.getBMIStatus(bmi);
      }

      const data: Prisma.CheckupMotherUpdateInput = {
        month: updateCheckupMothersAdminDto.month,
        height: updateCheckupMothersAdminDto.height,
        weight: updateCheckupMothersAdminDto.weight,
        upperArmCircumference:
          updateCheckupMothersAdminDto.upperArmCircumference,
        fundusMeasurement: updateCheckupMothersAdminDto.fundusMeasurement,
        bmi,
        bmiStatus,
        status: CheckupStatus.UNVERIFIED,
        type: OwnerType.ADMIN,
      };

      if (updateCheckupMothersAdminDto.healthPostId) {
        const healthPost = await this.healthPostRepository.first({
          id: updateCheckupMothersAdminDto.healthPostId,
        });
        if (!healthPost) {
          throw new Error('Health Post not found');
        }

        Object.assign(data, {
          healthPost: {
            connect: {
              id: updateCheckupMothersAdminDto.healthPostId,
            },
          },
        } satisfies Prisma.CheckupMotherUpdateInput);
      }

      if (updateCheckupMothersAdminDto.motherId) {
        const parent = await this.motherRepository.first({
          id: updateCheckupMothersAdminDto.motherId,
        });
        if (!parent) {
          throw new Error('Parent not found');
        }

        Object.assign(data, {
          parents: {
            connect: {
              id: updateCheckupMothersAdminDto.motherId,
            },
          },
        });
      }

      // if (updateCheckupMothersAdminDto.fileDiagnosed) {
      //   const fileDiagnosed = await this.filesService.upload({
      //     file: updateCheckupMothersAdminDto.fileDiagnosed,
      //     fileName: updateCheckupMothersAdminDto.name ?? 'document',
      //   });
      //   Object.assign(data, {
      //     fileDiagnosed: {
      //       connect: {
      //         id: fileDiagnosed.id,
      //       },
      //     },
      //   });
      // }

      return await this.checkupMotherRepository.update({ id }, data);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async verifyCheckup(id: string, fileId: string) {
    try {
      // Update the status to VERIFIED and upload the file
      const updatedCheckup = await this.checkupMotherRepository.update(
        { id },
        { fileDiagnosed: { connect: { id: fileId } }, status: 'VERIFIED' },
      );

      return updatedCheckup;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
