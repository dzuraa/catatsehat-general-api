import { Injectable } from '@nestjs/common';
import { PostpartumRecordRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreatePostpartumRecordDto } from '../dtos';
import { HealthStatus, Prisma, User } from '@prisma/client';
import { MotherRepository } from '../../mother/repositories';

@Injectable()
export class PostpartumRecordService {
  constructor(
    private readonly postPartumRecordRepository: PostpartumRecordRepository,
    private readonly motherRepository: MotherRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.postPartumRecordRepository.paginate(paginateDto);
  }

  public async index(dayPostPartumId: string, user: User) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother data not found');
    }

    const whereCondition: Prisma.PostPartumRecordWhereInput = {
      dayPostPartumId,
      mother: {
        id: mother.id,
      },
      deletedAt: null,
    };

    return this.postPartumRecordRepository.find({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        mother: true,
        dayPostPartum: true,
      },
    });
  }

  public detail(id: string) {
    return this.postPartumRecordRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        mother: true,
        dayPostPartum: true,
      },
    );
  }

  public async create(
    createPostpartumRecordDto: CreatePostpartumRecordDto,
    user: User,
  ) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother not found');
    }

    const existingRecord = await this.postPartumRecordRepository.findFirst({
      dayPostPartumId: createPostpartumRecordDto.dayPostPartumId,
      motherId: createPostpartumRecordDto.motherId,
      deletedAt: null,
    });

    if (existingRecord) {
      throw new Error('Data sudah tersedia untuk pilihan hari ini');
    }

    const questions = [
      createPostpartumRecordDto.question1,
      createPostpartumRecordDto.question2,
      createPostpartumRecordDto.question3,
      createPostpartumRecordDto.question4,
      createPostpartumRecordDto.question5,
      createPostpartumRecordDto.question6,
      createPostpartumRecordDto.question7,
      createPostpartumRecordDto.question8,
      createPostpartumRecordDto.question9,
      createPostpartumRecordDto.question10,
      createPostpartumRecordDto.question11,
      createPostpartumRecordDto.question12,
      createPostpartumRecordDto.question13,
      createPostpartumRecordDto.question14,
      createPostpartumRecordDto.question15,
      createPostpartumRecordDto.question16,
      createPostpartumRecordDto.question17,
      createPostpartumRecordDto.question18,
    ];

    const status: HealthStatus = questions.some(Boolean)
      ? HealthStatus.UNHEALTHY
      : HealthStatus.HEALTHY;

    const data: Prisma.PostPartumRecordCreateInput = {
      question1: createPostpartumRecordDto.question1,
      question2: createPostpartumRecordDto.question2,
      question3: createPostpartumRecordDto.question3,
      question4: createPostpartumRecordDto.question4,
      question5: createPostpartumRecordDto.question5,
      question6: createPostpartumRecordDto.question6,
      question7: createPostpartumRecordDto.question7,
      question8: createPostpartumRecordDto.question8,
      question9: createPostpartumRecordDto.question9,
      question10: createPostpartumRecordDto.question10,
      question11: createPostpartumRecordDto.question11,
      question12: createPostpartumRecordDto.question12,
      question13: createPostpartumRecordDto.question13,
      question14: createPostpartumRecordDto.question14,
      question15: createPostpartumRecordDto.question15,
      question16: createPostpartumRecordDto.question16,
      question17: createPostpartumRecordDto.question17,
      question18: createPostpartumRecordDto.question18,
      status,
      dayPostPartum: {
        connect: {
          id: createPostpartumRecordDto.dayPostPartumId,
        },
      },
      mother: {
        connect: {
          id: mother.id,
        },
      },
    };

    return this.postPartumRecordRepository.create(data);
  }
}
