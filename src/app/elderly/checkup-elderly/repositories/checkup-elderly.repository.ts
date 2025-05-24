import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.CheckupElderlyWhereInput;
  orderBy?: Prisma.CheckupElderlyOrderByWithRelationInput;
  cursor?: Prisma.CheckupElderlyWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.CheckupElderlyInclude;
};

@Injectable()
export class CheckupElderlyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.checkupElderly.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.checkupElderly.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.CheckupElderlyCreateInput) {
    return this.prismaService.checkupElderly.create({ data });
  }

  public async update(
    where: Prisma.CheckupElderlyWhereUniqueInput,
    data: Prisma.CheckupElderlyUpdateInput,
  ) {
    return this.prismaService.checkupElderly.update({ where, data });
  }

  public async delete(where: Prisma.CheckupElderlyWhereUniqueInput) {
    return this.prismaService.checkupElderly.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.CheckupElderlyWhereUniqueInput,
    select?: Prisma.CheckupElderlySelect,
  ) {
    return this.prismaService.checkupElderly.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.CheckupElderlyWhereUniqueInput,
    select?: Prisma.CheckupElderlySelect,
  ) {
    const data = await this.prismaService.checkupElderly.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.checkupElderly.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.checkupElderly.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.checkupElderly.count(filter)) > 0;
  }
}
