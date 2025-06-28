import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.MonthBloodWhereInput;
  orderBy?: Prisma.MonthBloodOrderByWithRelationInput;
  cursor?: Prisma.MonthBloodWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.MonthBloodInclude;
};

@Injectable()
export class MonthBloodRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.monthBlood.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.monthBlood.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.MonthBloodCreateInput) {
    return this.prismaService.monthBlood.create({ data });
  }

  public async update(
    where: Prisma.MonthBloodWhereUniqueInput,
    data: Prisma.MonthBloodUpdateInput,
  ) {
    return this.prismaService.monthBlood.update({ where, data });
  }

  public async first(
    where: Prisma.MonthBloodWhereUniqueInput,
    select?: Prisma.MonthBloodSelect,
  ) {
    return this.prismaService.monthBlood.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.MonthBloodWhereUniqueInput,
    select?: Prisma.MonthBloodSelect,
  ) {
    const data = await this.prismaService.monthBlood.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.monthBlood.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.monthBlood.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.monthBlood.count(filter)) > 0;
  }
}
