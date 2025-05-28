import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repositories';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  SearchScheduleDto,
} from '../dtos';
import { Prisma } from '@prisma/client';
import { AdminRepository } from '@app/admin/repositories';
import { HealthPostRepository } from '@app/healthpost/repositories';

@Injectable()
export class ScheduleServiceAdmin {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly adminRepository: AdminRepository,
    private readonly healthPostRepository: HealthPostRepository,
  ) {}

  public paginate(paginateDto: SearchScheduleDto) {
    const whereCondition: Prisma.ScheduleWhereInput = {
      deletedAt: null,
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
      },
      {
        healthPost: true,
        staff: true,
      },
    );
  }

  public async destroy(id: string) {
    return this.scheduleRepository.delete({
      id,
    });
  }

  public async create(createScheduleDto: CreateScheduleDto) {
    const data: Prisma.ScheduleCreateInput = {
      healthPost: { connect: { id: createScheduleDto.healthPostId } },
      staff: { connect: { id: createScheduleDto.staffId } },
      address: createScheduleDto.address,
      startAt: createScheduleDto.startAt,
      endAt: createScheduleDto.endAt,
      note: createScheduleDto.note,
    };
    return this.scheduleRepository.create(data);
  }

  public async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const data: Prisma.ScheduleUpdateInput = {
      address: updateScheduleDto.address,
      startAt: updateScheduleDto.startAt,
      endAt: updateScheduleDto.endAt,
      note: updateScheduleDto.note,
    };

    if (updateScheduleDto.healthPostId) {
      const healthPost = await this.healthPostRepository.first({
        id: updateScheduleDto.healthPostId,
      });
      if (!healthPost) {
        throw new Error('Health post not found');
      }

      Object.assign(data, {
        healthPost: {
          connect: {
            id: updateScheduleDto.healthPostId,
          },
        },
      });
    }

    if (updateScheduleDto.staffId) {
      const adminStaff = await this.adminRepository.first({
        id: updateScheduleDto.staffId,
      });
      if (!adminStaff) {
        throw new Error('Staff not found');
      }

      Object.assign(data, {
        staff: {
          connect: {
            id: updateScheduleDto.staffId,
          },
        },
      });
    }
    return this.scheduleRepository.update(
      {
        id,
      },
      data,
    );
  }
}
