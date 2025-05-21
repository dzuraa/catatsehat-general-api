import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.SubDistrictWhereInput;
  orderBy?: Prisma.SubDistrictOrderByWithRelationInput;
  cursor?: Prisma.SubDistrictWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.SubDistrictInclude;
};

@Injectable()
export class SubdistrictRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.subDistrict.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.subDistrict.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async findMany(filter: Filter) {
    return this.prismaService.subDistrict.findMany(filter);
  }

  public async first(
    where: Prisma.SubDistrictWhereUniqueInput,
    select?: Prisma.SubDistrictSelect,
  ) {
    return this.prismaService.subDistrict.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.SubDistrictWhereUniqueInput,
    select?: Prisma.SubDistrictSelect,
  ) {
    const data = await this.prismaService.subDistrict.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.subDistrict.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.subDistrict.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.subDistrict.count(filter)) > 0;
  }
}
