import { Injectable } from '@nestjs/common';
import { Filter, SubdistrictRepository } from '../repositories';
import { SubDistrictFilterDto } from '../dtos';

@Injectable()
export class SubdistrictService {
  constructor(private readonly subDistrictRepository: SubdistrictRepository) {}

  public async paginate(subDistrictFilterDto: SubDistrictFilterDto) {
    const filter: Filter = {
      where: {},
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        district: {
          select: {
            id: true,
            name: true,
            regency: {
              select: {
                id: true,
                name: true,
                province: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
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
    return await this.subDistrictRepository.paginate(
      subDistrictFilterDto,
      filter,
    );
  }

  public detail(id: string) {
    return this.subDistrictRepository.firstOrThrow({
      id,
    });
  }
}
