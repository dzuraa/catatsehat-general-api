import { Injectable } from '@nestjs/common';
import { CheckupChildrenRepository, Filter } from '../repositories';
import { BMIStatus, Gender } from '@prisma/client';
import { BMI_RANGES } from 'src/common/constants/bmi.constant';
import { ChildrenRepository } from '../../children/repositories';
import { SearchCheckupChildrenDto } from '../dtos/search-checkup-children.dto';

@Injectable()
export class CheckupChildrenService {
  constructor(
    private readonly checkupChildRepository: CheckupChildrenRepository,
    private readonly childrenRepository: ChildrenRepository,
  ) {}

  public calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public getBMIStatus(bmi: number, gender: Gender, age: number): BMIStatus {
    console.log(bmi, gender, age);
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

  public async paginate(
    paginateDto: SearchCheckupChildrenDto,
    childrenId: string,
  ) {
    const filter: Filter = {
      where: {
        deletedAt: null,
        childrenId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: true,
        fileDiagnosed: true,
      },
    };

    return this.checkupChildRepository.paginate(paginateDto, filter);
  }

  public countChildren(userId: string) {
    return this.checkupChildRepository.count({
      where: {
        id: {},
        children: {
          userId: userId,
        },
        deletedAt: null,
      },
    });
  }

  public detail(id: string) {
    try {
      return this.checkupChildRepository.firstOrThrow(
        {
          id,
          deletedAt: null,
        },
        {
          fileDiagnosed: true,
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
}
