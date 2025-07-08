import { Injectable } from '@nestjs/common';
import { Admin, Prisma } from '@prisma/client';
import { CreateBloodRecordDto, UpdateBloodRecordDto } from '../dtos';
import { BloodRecordSearchDto } from '../dtos/search-blood-record.dto';
import { BloodRecordRepository } from '../repositories';

@Injectable()
export class BloodRecordAdminService {
  constructor(private readonly bloodRecordRepository: BloodRecordRepository) {}

  public async paginate(paginateDto: BloodRecordSearchDto) {
    const whereCondition: Prisma.BloodRecordWhereInput = {
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
          monthBlood: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
          admin: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
          staffName: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.bloodRecordRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        mother: true,
        monthBlood: true,
        admin: true,
      },
    });
  }

  public detail(id: string) {
    return this.bloodRecordRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        admin: true,
        monthBlood: true,
        mother: true,
      },
    );
  }

  public async create(
    createBloodRecordDto: CreateBloodRecordDto,
    admin: Admin,
  ) {
    const existingRecord = await this.bloodRecordRepository.findFirst({
      motherId: createBloodRecordDto.motherId,
      date: createBloodRecordDto.date,
      monthId: createBloodRecordDto.monthId,
    });

    if (existingRecord) {
      throw new Error('Tidak dapat membuat pada tanggal ini, data sudah ada');
    }
    const data: Prisma.BloodRecordCreateInput = {
      date: createBloodRecordDto.date,
      monthBlood: {
        connect: {
          id: createBloodRecordDto.monthId,
        },
      },
      admin: {
        connect: {
          id: admin.id,
        },
      },
      mother: {
        connect: {
          id: createBloodRecordDto.motherId,
        },
      },
    };

    if (createBloodRecordDto.note) {
      data.note = createBloodRecordDto.note ?? null;
    }

    return await this.bloodRecordRepository.create(data);
  }

  public async update(
    id: string,
    admin: Admin,
    updateBloodRecordDto: UpdateBloodRecordDto,
  ) {
    const data: Prisma.BloodRecordUpdateInput = {
      date: updateBloodRecordDto.date,
      monthBlood: {
        connect: {
          id: updateBloodRecordDto.monthId,
        },
      },
      admin: {
        connect: {
          id: admin.id,
        },
      },
    };

    if (updateBloodRecordDto.note) {
      data.note = updateBloodRecordDto.note;
    }

    return this.bloodRecordRepository.update({ id }, data);
  }

  public async destroy(id: string) {
    return this.bloodRecordRepository.delete({ id });
  }
}
