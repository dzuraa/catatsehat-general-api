import { PrismaService } from '@/platform/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { HealthStatus } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import {
  FilterRecord,
  PregnancyMonitoringRecordRepository,
} from '../../pregnancy-monitoring-record/repositories';
import { CreatePregnancyMonitoringAnswersDto } from '../dtos';
import { Filter, PregnancyMonitoringRepository } from '../repositories';

@Injectable()
export class PregnancyMonitoringService {
  constructor(
    private readonly pregnancyMonitoringAnswerRepository: PregnancyMonitoringRepository,
    private readonly pregnancyMonitoringRecordRepository: PregnancyMonitoringRecordRepository,
    private readonly prisma: PrismaService,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.pregnancyMonitoringAnswerRepository.paginate(paginateDto);
  }

  public findAnswerByRecordId(pregnancyMonitoringRecordId: string) {
    const filter: Filter = {
      where: {
        pregnancyMonitoringRecordId: pregnancyMonitoringRecordId,
      },
    };
    return this.pregnancyMonitoringAnswerRepository.find(filter);
  }

  public async findRecordByWeekId(
    weekPregnancyMonitoringId: string,
    motherId: string,
  ) {
    const filter: FilterRecord = {
      where: {
        weekPregnancyMonitoringId: weekPregnancyMonitoringId,
        motherId: motherId,
      },
    };
    return this.pregnancyMonitoringRecordRepository.find(filter);
  }

  public detail(id: string) {
    try {
      return this.pregnancyMonitoringAnswerRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async submitPregnancyMonitoringAnswers(
    dto: CreatePregnancyMonitoringAnswersDto,
  ) {
    // 1. Cari PregnancyMonitoringRecord hasil seeding
    const pregnancyMonitoringRecord =
      await this.prisma.pregnancyMonitoringRecord.findFirstOrThrow({
        where: {
          motherId: dto.motherId,
          weekPregnancyMonitoringId: dto.weekPregnancyMonitoringId,
        },
      });

    // 2. Simpan jawaban dengan upsert
    const createPromises = dto.answers.map((answer) =>
      this.prisma.pregnancyMonitoringAnswer.upsert({
        where: {
          pregnancyMonitoringRecordId_pregnancyMonitoringQuestionId: {
            pregnancyMonitoringRecordId: pregnancyMonitoringRecord.id,
            pregnancyMonitoringQuestionId: answer.pregnancyMonitoringQuestionId,
          },
        },
        update: {
          answer: answer.answer,
        },
        create: {
          pregnancyMonitoringRecordId: pregnancyMonitoringRecord.id,
          pregnancyMonitoringQuestionId: answer.pregnancyMonitoringQuestionId,
          answer: answer.answer,
        },
      }),
    );

    await Promise.all(createPromises);

    // 3. Jika ada minimal 1 jawaban YES, update status jadi UNHEALTHY
    const hasYesAnswer = dto.answers.some((a) => a.answer === 'YES');

    if (hasYesAnswer) {
      await this.prisma.pregnancyMonitoringRecord.update({
        where: { id: pregnancyMonitoringRecord.id },
        data: { status: HealthStatus.UNHEALTHY }, // asumsi enum bernama HealthStatus
      });
    } else {
      await this.prisma.pregnancyMonitoringRecord.update({
        where: { id: pregnancyMonitoringRecord.id },
        data: { status: HealthStatus.HEALTHY }, // jika tidak ada jawaban YES, set ke HEALTHY
      });
    }

    return { message: 'Answers submitted successfully' };
  }
}
