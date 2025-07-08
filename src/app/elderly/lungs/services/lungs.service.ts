import { Injectable } from '@nestjs/common';
import { LungsRepository } from '../repositories';
import { CreateLungsDto, UpdateLungsDto } from '../dtos';
import { GetLungsDto } from '../dtos/get-lugs.dto';
import { DateTime } from 'luxon';

@Injectable()
export class LungsService {
  constructor(private readonly lungsRepository: LungsRepository) {}

  public paginate(paginateDto: GetLungsDto) {
    return this.lungsRepository.paginate(paginateDto, {
      include: {
        elderly: true,
        lungsPivot: {
          include: {
            masterDataLungs: true,
          },
        },
        lungsConclution: true,
      },
      where: {
        OR: [
          {
            elderly: {
              name: {
                contains: paginateDto.search,
                mode: 'insensitive',
              },
            },
            createdAt: paginateDto.date
              ? {
                  gte: DateTime.fromISO(paginateDto.date)
                    .startOf('day')
                    .toUTC()
                    .toJSDate(),
                  lte: DateTime.fromISO(paginateDto.date)
                    .endOf('day')
                    .toUTC()
                    .toJSDate(),
                }
              : undefined,
          },
        ],
      },
    });
  }

  public detail(id: string) {
    try {
      return this.lungsRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.lungsRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createLungsDto: CreateLungsDto) {
    try {
      return this.lungsRepository.create({
        elderly: {
          connect: {
            id: createLungsDto.elderlyId,
          },
        },
        lungsConclution: {
          connect: {
            id: createLungsDto.conclusionId,
          },
        },
        lungsPivot: {
          createMany: {
            data: createLungsDto.responses.map((response) => ({
              value: response.value,
              masterDataLungsId: response.id,
            })),
          },
        },
        score: createLungsDto.score,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateLungsDto: UpdateLungsDto) {
    try {
      return this.lungsRepository.update({ id }, updateLungsDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
