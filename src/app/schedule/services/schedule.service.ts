import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repositories';
import { SearchScheduleDto } from '../dtos';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  public paginate(paginateDto: SearchScheduleDto) {
    const whereCondition: Prisma.ScheduleWhereInput = {
      deletedAt: null,
      endAt: {
        gte: new Date(),
      },
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          healthPost: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
        {
          staff: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
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

    return this.scheduleRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        startAt: 'asc',
      },
      include: {
        healthPost: true,
        staff: true,
      },
    });
  }

  public detail(id: string) {
    return this.scheduleRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
        endAt: {
          gte: new Date(),
        },
      },
      {
        healthPost: true,
        staff: true,
      },
    );
  }

  public count() {
    return this.scheduleRepository.count({
      where: {
        id: {},
      },
    });
  }
}
