import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ProvinceWhereInput;
  orderBy?: Prisma.ProvinceOrderByWithRelationInput;
  cursor?: Prisma.ProvinceWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ProvinceInclude;
};

@Injectable()
export class ProvinceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.province.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.province.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async first(
    where: Prisma.ProvinceWhereUniqueInput,
    select?: Prisma.ProvinceSelect,
  ) {
    return this.prismaService.province.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ProvinceWhereUniqueInput,
    select?: Prisma.ProvinceSelect,
  ) {
    const data = await this.prismaService.province.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async findMany(filter: Filter) {
    return this.prismaService.province.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.province.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.province.count(filter)) > 0;
  }
}
