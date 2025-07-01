import { Injectable } from '@nestjs/common';
import { Filter, SubdistrictRepository } from '../repositories';
import { SubDistrictFilterDto } from '../dtos';

@Injectable()
export class SubdistrictService {
  constructor(private readonly subDistrictRepository: SubdistrictRepository) {}

  public async findMany(subDistrictFilterDto: SubDistrictFilterDto) {
    const filter: Filter = {
      where: {},
    };

    if (subDistrictFilterDto.districtId) {
      Object.assign(filter.where || {}, {
        districtId: subDistrictFilterDto.districtId,
      });
    }

    if (subDistrictFilterDto.search) {
      Object.assign(filter.where || {}, {
        name: {
          contains: subDistrictFilterDto.search,
          mode: 'insensitive',
        },
      });
    }
    return await this.subDistrictRepository.findMany(filter);
  }

  public detail(id: string) {
    return this.subDistrictRepository.firstOrThrow({
      id,
    });
  }
}
