import { OwnerType, Prisma } from '@prisma/client';
import { CreateBloodRecordDto } from '../dtos';
import { BloodRecordRepository } from '../repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BloodRecordPublicService {
  constructor(private readonly bloodRecordRepository: BloodRecordRepository) {}

  public async create(createBloodRecordDto: CreateBloodRecordDto) {
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
