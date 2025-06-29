import { Injectable } from '@nestjs/common';
import { ImmunizationOptionalRecordRepository } from '../repositories';
import {
  CreateImmunizationOptionalRecordDto,
  SearchImmunizationOptionalRecordDto,
  UpdateImmunizationOptionalRecordDto,
} from '../dtos';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImmunizationOptionalRecordAdminService {
  constructor(
    private readonly immunizationOptionalRecordRepository: ImmunizationOptionalRecordRepository,
  ) {}

  public paginate(paginateDto: SearchImmunizationOptionalRecordDto) {
    const whereCondition: Prisma.ImmunizationOptionalRecordWhereInput = {
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

  public async destroy(id: string) {
    return this.immunizationOptionalRecordRepository.delete({
      id,
    });
  }

  public async create(
    createImmunizationOptionalRecordDto: CreateImmunizationOptionalRecordDto,
  ) {
    const children =
      await this.immunizationOptionalRecordRepository.firstOrThrow({
        id: createImmunizationOptionalRecordDto.childrenId,
        deletedAt: null,
      });

    const data: Prisma.ImmunizationOptionalRecordCreateInput = {
      name: createImmunizationOptionalRecordDto.name,
      dateGiven: createImmunizationOptionalRecordDto.dateGiven,
      children: {
        connect: {
          id: children.id,
        },
      },
    };
    if (createImmunizationOptionalRecordDto.note) {
      data.note = createImmunizationOptionalRecordDto.note;
    }
  }

  public async update(
    id: string,
    updateImmunizationOptionalRecordDto: UpdateImmunizationOptionalRecordDto,
  ) {
    return this.immunizationOptionalRecordRepository.update(
      { id },
      updateImmunizationOptionalRecordDto,
    );
  }
}
