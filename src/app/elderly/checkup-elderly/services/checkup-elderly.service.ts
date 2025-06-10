import { Injectable } from '@nestjs/common';
import { CheckupElderlyRepository } from '../repositories';
import { CreateCheckupElderlyDto } from '../dtos';
// import { FileService } from 'src/app/file/services';
import { Admin, BMIStatus, CheckupStatus } from '@prisma/client';
import { BMI_RANGES_ELDERLY } from 'src/common/constants/bmi.constant';
import { SearchCheckupElderlyDto } from '../dtos/search-checkup-elderly.dto';
// import { HealthPostsRepository } from 'src/app/healthposts/repositories';
// import { AdminsRepository } from '@src/app/admins/repositories';
import { PrismaService } from '@/platform/database/services/prisma.service';
type CheckupElderlyWhereInput = {
  id?: string;
  deletedAt?: Date | null;
  attend?: {
    gte?: Date;
    lte?: Date;
  };
  OR?: Array<{
    elderly?: {
      name?: {
        contains?: string;
        mode?: 'insensitive';
      };
    };
    healthPost?: {
      name?: {
        contains?: string;
        mode?: 'insensitive';
      };
    };
  }>;
};

type CheckupElderlyCreateInput = {
  // name: string;
  height: number;
  weight: number;
  bloodTension: number;
  bloodSugar: number;
  attend: Date;
  bmi: number;
  bmiStatus: BMIStatus;
  status: CheckupStatus;
  healthPost?: {
    connect: {
      id: string;
    };
  };
};

type CheckupElderlyUpdateInput = {
  name?: string;
  height?: number;
  weight?: number;
  bloodTension?: number;
  bloodSugar?: number;
  attend?: Date;
  bmi?: number;
  bmiStatus?: BMIStatus;
  healthPost?: {
    connect: {
      id: string;
    };
  };
};

@Injectable()
export class CheckupElderlyService {
  constructor(
    private readonly checkupElderlyRepository: CheckupElderlyRepository,
    // private readonly fileService: FileService,
    // private readonly healthPostRepository: HealthPostsRepository,
    private readonly prisma: PrismaService,
  ) {}

  public calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public getBMIStatus(bmi: number): BMIStatus {
    const bmiRange = BMI_RANGES_ELDERLY.find(
      (range) => bmi >= range.min && bmi <= range.max,
    );

    if (!bmiRange) {
      throw new Error('BMI range not found');
    }
    return bmiRange.status;
  }

  public paginate(paginateDto: SearchCheckupElderlyDto) {
    const whereCondition: CheckupElderlyWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          elderly: {
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
      ];
    }

    // Add date filtering
    if (paginateDto.date) {
      const parts = paginateDto.date.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date.UTC
      const day = parseInt(parts[2], 10);

      // Create UTC date for the beginning of the day
      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      // Create UTC date for the end of the day
      const endDate = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

      whereCondition.attend = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.checkupElderlyRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        healthPost: true,
        elderly: true,
        // fileDiagnosed: true,
      },
    });
  }

  public async detail(id: string) {
    try {
      const result = await this.checkupElderlyRepository.find({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          healthPost: true,
        },
      });

      if (!result || result.length === 0) {
        throw new Error('Checkup elderly not found');
      }

      return result[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.checkupElderlyRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createCheckupElderlyDto: CreateCheckupElderlyDto,
    user?: Admin,
  ) {
    const bmi = this.calculateBmi(
      createCheckupElderlyDto.height,
      createCheckupElderlyDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi);

    const data: CheckupElderlyCreateInput = {
      height: createCheckupElderlyDto.height,
      weight: createCheckupElderlyDto.weight,
      bloodTension: createCheckupElderlyDto.bloodTension,
      bloodSugar: createCheckupElderlyDto.bloodSugar,
      attend: new Date(),
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
    };

    // if (createCheckupElderlyDto.healthPostId) {
    //   const healthPost = await this.healthPostRepository.first({
    //     id: createCheckupElderlyDto.healthPostId,
    //   });
    //   if (!healthPost) {
    //     throw new Error('Health Post not found');
    //   }

    //   Object.assign(data, {
    //     healthPost: {
    //       connect: {
    //         id: createCheckupElderlyDto.healthPostId,
    //       },
    //     },
    //   });
    // }

    // if (createCheckupElderlyDto.fileDiagnosed) {
    //   const fileDiagnosed = await this.fileService.upload({
    //     file: createCheckupElderlyDto.fileDiagnosed,
    //     fileName: createCheckupElderlyDto.name ?? '',
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

    const admin = await this.prisma.admin.findUnique({
      where: {
        id: user?.id,
      },
      include: {
        healthPost: true,
      },
    });

    if (admin) {
      Object.assign(data, {
        healthPost: {
          connect: {
            id: admin?.healthPostId ?? undefined,
          },
        },
        admin: {
          connect: {
            id: user?.id,
          },
        },
      });
    }

    return await this.checkupElderlyRepository.create({
      ...data,
      elderly: {
        connect: {
          id: createCheckupElderlyDto.elderlyId,
        },
      },
    });
  }

  public async update(
    id: string,
    updateCheckupElderlyDto: Partial<CreateCheckupElderlyDto>,
  ) {
    try {
      let bmi: number | undefined;
      let bmiStatus: BMIStatus | undefined;
      if (updateCheckupElderlyDto.height && updateCheckupElderlyDto.weight) {
        bmi = this.calculateBmi(
          updateCheckupElderlyDto.height,
          updateCheckupElderlyDto.weight,
        );
        bmiStatus = this.getBMIStatus(bmi);
      }

      const data: CheckupElderlyUpdateInput = {
        height: updateCheckupElderlyDto.height,
        weight: updateCheckupElderlyDto.weight,
        bloodTension: updateCheckupElderlyDto.bloodTension,
        bloodSugar: updateCheckupElderlyDto.bloodSugar,
        attend: updateCheckupElderlyDto.attend
          ? new Date(updateCheckupElderlyDto.attend)
          : undefined,
        bmi,
        bmiStatus,
      };

      // if (updateCheckupElderlyDto.healthPostId) {
      //   const healthPost = await this.healthPostRepository.first({
      //     id: updateCheckupElderlyDto.healthPostId,
      //   });
      //   if (!healthPost) {
      //     throw new Error('Health Post not found');
      //   }

      //   Object.assign(data, {
      //     healthPost: {
      //       connect: {
      //         id: updateCheckupElderlyDto.healthPostId,
      //       },
      //     },
      //   });
      // }

      // if (updateCheckupElderlyDto.fileDiagnosed) {
      //   const fileDiagnosed = await this.fileService.upload({
      //     file: updateCheckupElderlyDto.fileDiagnosed,
      //     fileName: updateCheckupElderlyDto.name ?? 'document',
      //   });
      //   Object.assign(data, {
      //     fileDiagnosed: {
      //       connect: {
      //         id: fileDiagnosed.id,
      //       },
      //     },
      //   });
      // }

      return await this.checkupElderlyRepository.update({ id }, data);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // public async verifyCheckup(id: string, fileId: string) {
  //   try {
  //     // Update the status to VERIFIED and upload the file
  //     const updatedCheckup = await this.checkupElderlyRepository.update(
  //       { id },
  //       { fileDiagnosed: { connect: { id: fileId } }, status: 'VERIFIED' },
  //     );

  //     return updatedCheckup;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
}
