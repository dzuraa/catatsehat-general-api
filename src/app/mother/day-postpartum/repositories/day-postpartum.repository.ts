import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.DayPostPartumWhereInput;
  orderBy?: Prisma.DayPostPartumOrderByWithRelationInput;
  cursor?: Prisma.DayPostPartumWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.DayPostPartumInclude;
};

@Injectable()
export class DayPostpartumRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.dayPostPartum.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.dayPostPartum.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.DayPostPartumCreateInput) {
    return this.prismaService.dayPostPartum.create({ data });
  }

  public async update(
    where: Prisma.DayPostPartumWhereUniqueInput,
    data: Prisma.DayPostPartumUpdateInput,
  ) {
    return this.prismaService.dayPostPartum.update({ where, data });
  }

  public async first(
    where: Prisma.DayPostPartumWhereUniqueInput,
    select?: Prisma.DayPostPartumSelect,
  ) {
    return this.prismaService.dayPostPartum.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.DayPostPartumWhereUniqueInput,
    select?: Prisma.DayPostPartumSelect,
  ) {
    const data = await this.prismaService.dayPostPartum.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.dayPostPartum.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.dayPostPartum.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.dayPostPartum.count(filter)) > 0;
  }
}
