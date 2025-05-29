import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.CheckupMotherWhereInput;
  orderBy?: Prisma.CheckupMotherOrderByWithRelationInput;
  cursor?: Prisma.CheckupMotherWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.CheckupMotherInclude;
};

@Injectable()
export class CheckupMotherRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.checkupMother.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.checkupMother.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.CheckupMotherCreateInput) {
    return this.prismaService.checkupMother.create({ data });
  }

  public async update(
    where: Prisma.CheckupMotherWhereUniqueInput,
    data: Prisma.CheckupMotherUpdateInput,
  ) {
    return this.prismaService.checkupMother.update({ where, data });
  }

  public async delete(where: Prisma.CheckupMotherWhereUniqueInput) {
    return this.prismaService.checkupMother.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.CheckupMotherWhereUniqueInput,
    select?: Prisma.CheckupMotherSelect,
  ) {
    return this.prismaService.checkupMother.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.CheckupMotherWhereUniqueInput,
    select?: Prisma.CheckupMotherSelect,
  ) {
    const data = await this.prismaService.checkupMother.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.checkupMother.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.checkupMother.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.checkupMother.count(filter)) > 0;
  }
}
