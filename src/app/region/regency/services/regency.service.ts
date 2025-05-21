import { Injectable } from '@nestjs/common';
import { Filter, RegencyRepository } from '../repositories';
import { RegencyFilterDto } from '../dtos';

@Injectable()
export class RegencyService {
  constructor(private readonly regencyRepository: RegencyRepository) {}

  public async findMany(regencyFilterDto: RegencyFilterDto) {
    const filter: Filter = {
      where: {},
    };

    if (regencyFilterDto.provinceId) {
      Object.assign(filter.where || {}, {
        provinceId: regencyFilterDto.provinceId,
      });
    }

    if (regencyFilterDto.search) {
      Object.assign(filter.where || {}, {
        name: {
          contains: regencyFilterDto.search,
          mode: 'insensitive',
        },
      });
    }
    return await this.regencyRepository.findMany(filter);
  }

  public detail(id: string) {
    try {
      return this.regencyRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
