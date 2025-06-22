import { Injectable } from '@nestjs/common';
import { BloodRecordRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Prisma, User } from '@prisma/client';
import { MotherRepository } from '../../mother/repositories';

@Injectable()
export class BloodRecordService {
  constructor(
    private readonly bloodRecordRepository: BloodRecordRepository,
    private readonly motherRepository: MotherRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.bloodRecordRepository.paginate(paginateDto);
  }

  public async index(monthId: string, user: User) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother data not found');
    }

    const whereCondition: Prisma.BloodRecordWhereInput = {
      monthId,
      mother: {
        id: mother.id,
      },
      deletedAt: null,
    };

    const records = await this.bloodRecordRepository.find({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        monthBlood: true,
        admin: true,
      },
    });

    const monthName = records[0]?.monthBlood.name ?? '-';
    const totalConsume = records.length;
    const statusBlood = totalConsume > 0 ? 'DONE' : 'NOT_DONE';

    return {
      monthName,
      totalConsume,
      statusBlood,
      data: records,
    };
  }

  public detail(id: string) {
    return this.bloodRecordRepository.firstOrThrow({
      id,
      deletedAt: null,
    });
  }
}
