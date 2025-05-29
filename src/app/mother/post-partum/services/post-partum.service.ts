import { PrismaService } from '@/platform/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
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

  public findRecordByDayId(dayPostPartumId: string) {
    const filter: FilterRecord = {
      where: {
        dayPostPartumId: dayPostPartumId,
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
    const { postPartumRecordId, answers } = dto;

    const createPromises = answers.map((answer) =>
      this.prisma.postPartumAnswer.upsert({
        where: {
          postPartumRecordId_postPartumQuestionId: {
            postPartumRecordId,
            postPartumQuestionId: answer.postPartumQuestionId,
          },
        },
        update: {
          answer: answer.answer,
        },
        create: {
          postPartumRecordId,
          postPartumQuestionId: answer.postPartumQuestionId,
          answer: answer.answer,
        },
      }),
    );

    await Promise.all(createPromises);

    return { message: 'Answers submitted successfully' };
  }
}
