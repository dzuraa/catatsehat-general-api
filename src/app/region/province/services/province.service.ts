import { Injectable } from '@nestjs/common';
import { Filter, ProvinceRepository } from '../repositories';
import { ProvinceFilterDto } from '../dtos';

@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  public async findMany(provinceFilterDto: ProvinceFilterDto) {
    const filter: Filter = {
      where: {},
    };

    if (provinceFilterDto.search) {
      Object.assign(filter.where || {}, {
        name: {
          contains: provinceFilterDto.search,
          mode: 'insensitive',
        },
      });
    }
    return await this.provinceRepository.findMany(filter);
  }

  public detail(id: string) {
    try {
      return this.provinceRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
