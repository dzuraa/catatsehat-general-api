import { Injectable } from '@nestjs/common';
import { PregnancyMonitoringRecordRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import {
  CreatePregnancyMonitoringRecordDto,
  SearchPregnancyMonitoringRecordDto,
} from '../dtos';
import { MotherRepository } from '../../mother/repositories';
import { HealthStatus, Prisma, User } from '@prisma/client';

@Injectable()
export class PregnancyMonitoringRecordService {
  constructor(
    private readonly pregnancyMonitoringRecordRepository: PregnancyMonitoringRecordRepository,
    private readonly motherRepository: MotherRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.pregnancyMonitoringRecordRepository.paginate(paginateDto);
  }

  public async index(
    filterDto: SearchPregnancyMonitoringRecordDto,
    user: User,
  ) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother data not found');
    }

    const whereCondition: Prisma.PregnancyMonitoringRecordWhereInput = {
      mother: {
        id: mother.id,
      },
      deletedAt: null,
    };

    if (filterDto.weekPregnancyMonitoringId) {
      whereCondition.weekPregnancyMonitoring = {
        id: filterDto.weekPregnancyMonitoringId,
      };
    }

    if (filterDto.trimesterId) {
      whereCondition.weekPregnancyMonitoring = {
        trimesterId: filterDto.trimesterId,
      };
    }

    if (filterDto.search) {
      whereCondition.OR = [
        {
          mother: {
            name: {
              contains: filterDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
        {
          weekPregnancyMonitoring: {
            name: {
              contains: filterDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    return this.pregnancyMonitoringRecordRepository.find({
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

  public async getWeekUsed(user: User) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother not found');
    }

    const records = await this.pregnancyMonitoringRecordRepository.find({
      where: {
        motherId: mother.id,
        deletedAt: null,
      },
      select: {
        weekPregnancyMonitoringId: true,
      },
    });

    // Hasilnya array of IDs yang sudah digunakan
    return records.map((r) => r.weekPregnancyMonitoringId);
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

  public async create(
    createPregnancyMonitoringRecordDto: CreatePregnancyMonitoringRecordDto,
    user: User,
  ) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother not found');
    }

    const existingRecord =
      await this.pregnancyMonitoringRecordRepository.findFirst({
        weekPregnancyMonitoringId:
          createPregnancyMonitoringRecordDto.weekPregnancyMonitoringId,
        motherId: createPregnancyMonitoringRecordDto.motherId,
        deletedAt: null,
      });

    if (existingRecord) {
      throw new Error('Data sudah tersedia untuk pilihan minggu ini');
    }

    const questions = [
      createPregnancyMonitoringRecordDto.question1,
      createPregnancyMonitoringRecordDto.question2,
      createPregnancyMonitoringRecordDto.question3,
      createPregnancyMonitoringRecordDto.question4,
      createPregnancyMonitoringRecordDto.question5,
      createPregnancyMonitoringRecordDto.question6,
      createPregnancyMonitoringRecordDto.question7,
      createPregnancyMonitoringRecordDto.question8,
      createPregnancyMonitoringRecordDto.question9,
      createPregnancyMonitoringRecordDto.question10,
      createPregnancyMonitoringRecordDto.question11,
      createPregnancyMonitoringRecordDto.question12,
      createPregnancyMonitoringRecordDto.question13,
    ];

    const status: HealthStatus = questions.some(Boolean)
      ? HealthStatus.UNHEALTHY
      : HealthStatus.HEALTHY;

    const data: Prisma.PregnancyMonitoringRecordCreateInput = {
      question1: createPregnancyMonitoringRecordDto.question1,
      question2: createPregnancyMonitoringRecordDto.question2,
      question3: createPregnancyMonitoringRecordDto.question3,
      question4: createPregnancyMonitoringRecordDto.question4,
      question5: createPregnancyMonitoringRecordDto.question5,
      question6: createPregnancyMonitoringRecordDto.question6,
      question7: createPregnancyMonitoringRecordDto.question7,
      question8: createPregnancyMonitoringRecordDto.question8,
      question9: createPregnancyMonitoringRecordDto.question9,
      question10: createPregnancyMonitoringRecordDto.question10,
      question11: createPregnancyMonitoringRecordDto.question11,
      question12: createPregnancyMonitoringRecordDto.question12,
      question13: createPregnancyMonitoringRecordDto.question13,
      status,
      weekPregnancyMonitoring: {
        connect: {
          id: createPregnancyMonitoringRecordDto.weekPregnancyMonitoringId,
        },
      },
      mother: {
        connect: {
          id: mother.id,
        },
      },
    };

    return this.pregnancyMonitoringRecordRepository.create(data);
  }
}
