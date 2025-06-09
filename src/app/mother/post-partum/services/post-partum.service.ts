import { UserRepository } from '@/app/users/repositories';
import { PrismaService } from '@/platform/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { HealthStatus } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import {
  FilterRecord,
  PostpartumRecordRepository,
} from '../../postpartum-record/repositories';
import { CreatePostPartumAnswersDto } from '../dtos';
import { Filter, PostPartumRepository } from '../repositories';

@Injectable()
export class PostPartumService {
  constructor(
    private readonly postPartumAnswerRepository: PostPartumRepository,
    private readonly prisma: PrismaService,
    private readonly postPartumRecordRepository: PostpartumRecordRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.postPartumAnswerRepository.paginate(paginateDto);
  }

  public findAnswerByRecordId(postPartumRecordId: string) {
    const filter: Filter = {
      where: {
        postPartumRecordId: postPartumRecordId,
      },
    };
    return this.postPartumAnswerRepository.find(filter);
  }

  public async findRecordByDayId(dayPostPartumId: string, motherId: string) {
    const filter: FilterRecord = {
      where: {
        dayPostPartumId: dayPostPartumId,
        motherId: motherId,
      },
    };
    return this.postPartumRecordRepository.find(filter);
  }

  public detail(id: string) {
    try {
      return this.postPartumAnswerRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async submitPostPartumAnswers(dto: CreatePostPartumAnswersDto) {
    // 1. Cari PostPartumRecord hasil seeding
    const postPartumRecord =
      await this.prisma.postPartumRecord.findFirstOrThrow({
        where: {
          motherId: dto.motherId,
          dayPostPartumId: dto.dayPostPartumId,
        },
      });

    // 2. Simpan jawaban dengan upsert
    const createPromises = dto.answers.map((answer) =>
      this.prisma.postPartumAnswer.upsert({
        where: {
          postPartumRecordId_postPartumQuestionId: {
            postPartumRecordId: postPartumRecord.id,
            postPartumQuestionId: answer.postPartumQuestionId,
          },
        },
        update: {
          answer: answer.answer,
        },
        create: {
          postPartumRecordId: postPartumRecord.id,
          postPartumQuestionId: answer.postPartumQuestionId,
          answer: answer.answer,
        },
      }),
    );

    await Promise.all(createPromises);

    // 3. Jika ada minimal 1 jawaban YES, update status jadi UNHEALTHY
    const hasYesAnswer = dto.answers.some((a) => a.answer === 'YES');

    if (hasYesAnswer) {
      await this.prisma.postPartumRecord.update({
        where: { id: postPartumRecord.id },
        data: { status: HealthStatus.UNHEALTHY }, // asumsi enum bernama HealthStatus
      });
    } else {
      await this.prisma.postPartumRecord.update({
        where: { id: postPartumRecord.id },
        data: { status: HealthStatus.HEALTHY }, // jika tidak ada jawaban YES, set ke HEALTHY
      });
    }

    return { message: 'Answers submitted successfully' };
  }
}
