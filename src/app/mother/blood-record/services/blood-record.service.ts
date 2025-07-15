import { Injectable } from '@nestjs/common';
import { BloodRecordRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Prisma, User } from '@prisma/client';
import { MotherRepository } from '../../mother/repositories';
import { BloodRecordSearchDto } from '../dtos';

@Injectable()
export class BloodRecordService {
  constructor(
    private readonly bloodRecordRepository: BloodRecordRepository,
    private readonly motherRepository: MotherRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.bloodRecordRepository.paginate(paginateDto);
  }

  public async index(filterDto: BloodRecordSearchDto, user: User) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });

    if (!mother) {
      throw new Error('Mother data not found');
    }

    const whereCondition: Prisma.BloodRecordWhereInput = {
      mother: {
        id: mother.id,
      },
      deletedAt: null,
    };

    if (filterDto.monthId) {
      whereCondition.monthBlood = {
        id: filterDto.monthId,
      };
    }

    if (filterDto.search) {
      whereCondition.OR = [
        {
          monthBlood: {
            name: {
              contains: filterDto.search,
              mode: 'insensitive',
            },
          },
        },
        {
          admin: {
            name: {
              contains: filterDto.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

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

    // Kelompokkan berdasarkan bulan
    const grouped = records.reduce(
      (acc, record) => {
        const monthKey = record.monthBlood.name; // Bisa ganti ke monthBlood.id kalau perlu unik
        if (!acc[monthKey]) {
          acc[monthKey] = {
            monthName: record.monthBlood.name,
            totalConsume: 0,
            statusBlood: 'NOT_DONE',
            data: [],
          };
        }

        acc[monthKey].data.push(record);
        acc[monthKey].totalConsume += 1;
        acc[monthKey].statusBlood = 'DONE';

        return acc;
      },
      {} as Record<
        string,
        {
          monthName: string;
          totalConsume: number;
          statusBlood: string;
          data: typeof records;
        }
      >,
    );

    return Object.values(grouped); // controller yang akan bungkus response-nya
  }

  public detail(id: string) {
    return this.bloodRecordRepository.firstOrThrow({
      id,
      deletedAt: null,
    });
  }
}
