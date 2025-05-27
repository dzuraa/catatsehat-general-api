import { Injectable } from '@nestjs/common';
import { Filter, HealthPostRepository } from '../repositories';
import {
  CreateHealthPostDto,
  UpdateHealthPostDto,
  SearchHealthPostDto,
} from '../dtos';

import { Prisma } from '@prisma/client';
import { SubdistrictRepository } from '@app/region/subdistrict/repositories';

@Injectable()
export class HealthPostService {
  constructor(
    private readonly healthPostRepository: HealthPostRepository,
    private readonly subDistrictRepository: SubdistrictRepository,
  ) {}

  public paginate(paginateDto: SearchHealthPostDto) {
    const whereCondition: Prisma.HealthPostWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          name: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          address: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          subDistrict: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
      ];
    }
    return this.healthPostRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subDistrict: true,
      },
    });
  }

  public detail(id: string) {
    return this.healthPostRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        subDistrict: true,
      },
    );
  }

  public async destroy(id: string) {
    return this.healthPostRepository.delete({
      id,
    });
  }

  public async create(createHealthPostDto: CreateHealthPostDto) {
    const data: Prisma.HealthPostCreateInput = {
      name: createHealthPostDto.name,
      address: createHealthPostDto.address,
      subDistrict: { connect: { id: createHealthPostDto.subDistrictId } },
    };

    return this.healthPostRepository.create(data);
  }

  public async update(id: string, updateHealthPostDto: UpdateHealthPostDto) {
    const data: Prisma.HealthPostUpdateInput = {
      name: updateHealthPostDto.name,
      address: updateHealthPostDto.address,
    };

    if (updateHealthPostDto.subDistrictId) {
      const subDistrictData = await this.subDistrictRepository.first({
        id: updateHealthPostDto.subDistrictId,
      });
      if (!subDistrictData) {
        throw new Error('Sub district not found');
      }

      Object.assign(data, {
        subDistrict: { connect: { id: updateHealthPostDto.subDistrictId } },
      });
    }

    return this.healthPostRepository.update({ id }, data);
  }

  public async findMany(paginateDto: SearchHealthPostDto) {
    const filter: Filter = {
      where: {
        deletedAt: null,
      },
    };

    if (paginateDto.search) {
      Object.assign(filter.where || {}, {
        name: {
          contains: paginateDto.search,
          mode: 'insensitive',
        },
      });
    }
    return await this.healthPostRepository.findAll(filter);
  }
}
