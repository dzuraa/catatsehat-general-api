import { Injectable } from '@nestjs/common';
import { PostpartumRecordRepository } from '../repositories';
import { FilterPostpartumRecordDto } from '../dtos';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostpartumRecordAdminService {
  constructor(
    private readonly postPartumRecordRepository: PostpartumRecordRepository,
  ) {}

  public paginate(paginateDto: FilterPostpartumRecordDto) {
    const whereCondition: Prisma.PostPartumRecordWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          mother: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
          dayPostPartum: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    return this.postPartumRecordRepository.paginate(paginateDto, {
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
}
