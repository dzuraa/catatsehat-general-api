import { Injectable } from '@nestjs/common';
import { CheckupChildrenRepository, Filter } from '../repositories';
import { BMIStatus, Gender } from '@prisma/client';
import { BMI_RANGES } from 'src/common/constants/bmi.constant';
import { SearchCheckupChildrenDto } from '../dtos/search-checkup-children.dto';
import { DateTime } from 'luxon';

@Injectable()
export class CheckupChildrenService {
  constructor(
    private readonly checkupChildrenRepository: CheckupChildrenRepository,
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

    return this.checkupChildrenRepository.paginate(paginateDto, filter);
  }

  public countChildren(userId: string) {
    return this.checkupChildrenRepository.count({
      where: {
        id: {},
        children: {
          userId: userId,
        },
        deletedAt: null,
      },
    });
  }

  public async detail(id: string) {
    const data = await this.checkupChildrenRepository.firstOrThrow(
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

    const birth = DateTime.fromISO(data.children.dateOfBirth.toISOString());
    const now = DateTime.now();
    const age = now.diff(birth, 'years').years;
    const ageRounded = Math.floor(age);

    const children = {
      ...data.children,
      age: ageRounded,
    };

    data.children = children;

    return data;
  }
}
