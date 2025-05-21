import { Injectable } from '@nestjs/common';
import { DistrictRepository, Filter } from '../repositories';
import { DistrictFilterDto } from '../dtos';

@Injectable()
export class DistrictService {
  constructor(private readonly districtRepository: DistrictRepository) {}

  public async findMany(districtFilterDto: DistrictFilterDto) {
    const filter: Filter = {
      where: {},
    };

    if (districtFilterDto.regencyId) {
      Object.assign(filter.where || {}, {
        regencyId: districtFilterDto.regencyId,
      });
    }

    if (districtFilterDto.search) {
      Object.assign(filter.where || {}, {
        name: {
          contains: districtFilterDto.search,
          mode: 'insensitive',
        },
      });
    }
    return await this.districtRepository.findMany(filter);
  }

  public detail(id: string) {
    return this.districtRepository.firstOrThrow({
      id,
    });
  }
}
