import { Injectable } from '@nestjs/common';
import { ImmunizationOptionalRecordRepository } from '../repositories';
import { SearchImmunizationOptionalRecordDto } from '../dtos';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImmunizationOptionalRecordService {
  constructor(
    private readonly immunizationOptionalRecordRepository: ImmunizationOptionalRecordRepository,
  ) {}

  public paginate(
    paginateDto: SearchImmunizationOptionalRecordDto,
    childrenId: string,
  ) {
    const whereCondition: Prisma.ImmunizationOptionalRecordWhereInput = {
      childrenId,
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          name: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          note: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.immunizationOptionalRecordRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: {
          include: {
            mother: true,
          },
        },
      },
    });
  }
  public detail(id: string) {
    return this.immunizationOptionalRecordRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        children: {
          include: {
            mother: true,
          },
        },
      },
    );
  }
}
