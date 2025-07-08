import { Injectable } from '@nestjs/common';
import { OwnerType, Prisma } from '@prisma/client';
import { CreateBloodRecordDto } from '../dtos';
import { BloodRecordRepository } from '../repositories';

@Injectable()
export class BloodRecordPublicService {
  constructor(private readonly bloodRecordRepository: BloodRecordRepository) {}

  public async create(createBloodRecordDto: CreateBloodRecordDto) {
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
      staffName: createBloodRecordDto.staffName,
      staffJob: createBloodRecordDto.staffJob,
      type: OwnerType.PUBLIC,
      monthBlood: {
        connect: {
          id: createBloodRecordDto.monthId,
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
}
