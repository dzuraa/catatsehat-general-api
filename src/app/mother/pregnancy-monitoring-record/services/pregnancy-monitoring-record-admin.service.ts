import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PregnancyMonitoringRecordRepository } from '../repositories';
import { SearchPregnancyMonitoringRecordDto } from '../dtos';

@Injectable()
export class PregnancyMonitoringRecordAdminService {
  constructor(
    private readonly pregnancyMonitoringRecordRepository: PregnancyMonitoringRecordRepository,
  ) {}

  public paginate(paginateDto: SearchPregnancyMonitoringRecordDto) {
    const whereCondition: Prisma.PregnancyMonitoringRecordWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.weekPregnancyMonitoringId) {
      whereCondition.weekPregnancyMonitoring = {
        id: paginateDto.weekPregnancyMonitoringId,
      };
    }

    if (paginateDto.trimesterId) {
      whereCondition.weekPregnancyMonitoring = {
        trimesterId: paginateDto.trimesterId,
      };
    }

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          mother: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
          weekPregnancyMonitoring: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    return this.pregnancyMonitoringRecordRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        mother: true,
        weekPregnancyMonitoring: true,
      },
    });
  }

  public detail(id: string) {
    return this.pregnancyMonitoringRecordRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        mother: true,
        weekPregnancyMonitoring: true,
      },
    );
  }
}
