import { Injectable } from '@nestjs/common';
import {
  Prisma,
  BMIStatus,
  CheckupStatus,
  Gender,
  Admin,
} from '@prisma/client';
import { BMI_RANGES } from 'src/common/constants/bmi.constant';
import { DateTime } from 'luxon';
import { ChildrenRepository } from '../../children/repositories';
import { CheckupChildrenRepository, Filter } from '../repositories';
import { FileService } from '@/app/file/services';
import { SearchCheckupChildrenDto } from '../dtos/search-checkup-children.dto';
import { HealthPostRepository } from '@/app/healthpost/repositories';
import { AdminRepository } from '@/app/admin/repositories';
import { CreateCheckupChildrenDto, UpdateCheckupChildrenDto } from '../dtos';

@Injectable()
export class CheckupChildrenAdminService {
  constructor(
    private readonly checkupChildrenRepository: CheckupChildrenRepository,
    private readonly filesService: FileService,
    private readonly childrenRepository: ChildrenRepository,
    private readonly healthPostRepository: HealthPostRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  private calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  private getBMIStatus(bmi: number, gender: Gender, age: number): BMIStatus {
    // Get the age group ranges for the given gender
    const ageGroups = BMI_RANGES[gender || 'MALE'];

    // Find the appropriate age group
    const ageGroup = ageGroups.find(
      (group) => age >= group.min && age < group.max,
    );
    if (!ageGroup) {
      throw new Error('Age group not found');
    }

    // Find the BMI range that matches the calculated BMI
    const bmiRange = ageGroup.ranges.find(
      (range) => bmi >= range.min && bmi <= range.max,
    );
    if (!bmiRange) {
      throw new Error('BMI range not found');
    }

    return bmiRange.status;
  }

  public async paginate(paginateDto: SearchCheckupChildrenDto) {
    const whereCondition: Prisma.CheckupChildrenWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          children: {
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
    const filter: Filter = {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: true,
        healthPost: true,
        admin: true,
        fileDiagnosed: true,
      },
    };

    return this.checkupChildrenRepository.paginate(paginateDto, filter);
  }

  public detail(id: string) {
    try {
      return this.checkupChildrenRepository.firstOrThrow(
        {
          id,
          deletedAt: null,
        },
        {
          healthPost: true,
          fileDiagnosed: true,
          admin: true,
          children: {
            include: {
              childPicture: true,
            },
          },
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.checkupChildrenRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createCheckupChildrenDto: CreateCheckupChildrenDto,
    admin: Admin,
  ) {
    const child = await this.childrenRepository.firstOrThrow({
      id: createCheckupChildrenDto.childrenId,
    });
    if (!child) {
      throw new Error('Error: Child not found');
    }

    const diffMonth = Math.abs(
      DateTime.fromJSDate(child?.dateOfBirth as Date).diffNow('months')
        .months || 0,
    );
    const age = Number((diffMonth / 12).toFixed(1));

    if (age < 0 || age > 6) {
      throw new Error('err.bmi_age');
    }

    const bmi = this.calculateBmi(
      createCheckupChildrenDto.height,
      createCheckupChildrenDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi, child.gender as Gender, age);

    const data: Prisma.CheckupChildrenCreateInput = {
      height: createCheckupChildrenDto.height,
      weight: createCheckupChildrenDto.weight,
      headCircumference: createCheckupChildrenDto.headCircumference,
      gender: createCheckupChildrenDto.gender,
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
      admin: {
        connect: {
          id: admin.id,
        },
      },
      children: {
        connect: {
          id: createCheckupChildrenDto.childrenId,
        },
      },
      healthPost: {
        connect: {
          id: createCheckupChildrenDto.healthPostId,
        },
      },
    };

    if (
      createCheckupChildrenDto.fileDiagnosed &&
      createCheckupChildrenDto.fileDiagnosed !== 'string' &&
      createCheckupChildrenDto.fileDiagnosed.length > 0
    ) {
      const fileDiagnosed = await this.filesService.upload({
        file: createCheckupChildrenDto.fileDiagnosed,
        fileName: child.name ?? 'document',
      });

      data.status = CheckupStatus.VERIFIED;
      data.fileDiagnosed = {
        connect: {
          id: fileDiagnosed.id,
        },
      };
    }

    return await this.checkupChildrenRepository.create(data);
  }

  public async update(
    id: string,
    updateCheckupChildrenDto: UpdateCheckupChildrenDto,
  ) {
    const checkupChild = await this.checkupChildrenRepository.first(
      {
        id,
        deletedAt: null,
      },
      {
        healthPost: true,
        children: true,
      },
    );

    if (!checkupChild) {
      throw new Error('Error: Checkup child not found');
    }
    if (!checkupChild.children) {
      throw new Error('Error: Checkup child does not have an associated child');
    }
    const child = checkupChild?.children || null;

    const diffMonth = Math.abs(
      DateTime.fromJSDate(child?.dateOfBirth as Date).diffNow('months')
        .months || 0,
    );
    const age = Number((diffMonth / 12).toFixed(1));

    let bmi: number | undefined;
    let bmiStatus: BMIStatus | undefined;

    if (updateCheckupChildrenDto.height && updateCheckupChildrenDto.weight) {
      if ((age as number) < 0 || (age as number) > 6) {
        throw new Error('err.bmi_age');
      }

      bmi = this.calculateBmi(
        updateCheckupChildrenDto.height as number,
        updateCheckupChildrenDto.weight as number,
      );
      bmiStatus = this.getBMIStatus(
        bmi,
        updateCheckupChildrenDto.gender as Gender,
        age as number,
      );
    }

    const data: Prisma.CheckupChildrenUpdateInput = {
      height: updateCheckupChildrenDto.height,
      weight: updateCheckupChildrenDto.weight,
      headCircumference: updateCheckupChildrenDto.headCircumference,
      gender: updateCheckupChildrenDto.gender,
      bmi,
      bmiStatus,
    };

    if (updateCheckupChildrenDto.healthPostId) {
      const healthPost = await this.healthPostRepository.first({
        id: updateCheckupChildrenDto.healthPostId,
      });
      if (!healthPost) {
        throw new Error('Error: Health post not found');
      }

      Object.assign(data, {
        healthPost: {
          connect: {
            id: updateCheckupChildrenDto.healthPostId,
          },
        },
      });
    }

    if (updateCheckupChildrenDto.fileDiagnosed) {
      const fileDiagnosed = await this.filesService.upload({
        file: updateCheckupChildrenDto.fileDiagnosed,
        fileName: child.name ?? 'document',
      });

      data.status = CheckupStatus.VERIFIED;
      data.fileDiagnosed = {
        connect: {
          id: fileDiagnosed.id,
        },
      };
    }
    const where: Prisma.CheckupChildrenWhereUniqueInput = { id };

    return await this.checkupChildrenRepository.update(where, data);
  }
}
