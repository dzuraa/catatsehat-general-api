import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.MotherWhereInput;
  orderBy?: Prisma.MotherOrderByWithRelationInput;
  cursor?: Prisma.MotherWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.MotherInclude;
};

@Injectable()
export class MotherRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.mother.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.mother.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.MotherCreateInput) {
    return this.prismaService.mother.create({ data });
  }

  public async update(
    where: Prisma.MotherWhereUniqueInput,
    data: Prisma.MotherUpdateInput,
  ) {
    return this.prismaService.mother.update({ where, data });
  }

  public async delete(where: Prisma.MotherWhereUniqueInput) {
    return this.prismaService.mother.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.MotherWhereUniqueInput,
    select?: Prisma.MotherSelect,
  ) {
    return this.prismaService.mother.findUnique({ where, select });
  }

  public async findFirst(
    where: Prisma.MotherWhereInput,
    select?: Prisma.MotherSelect,
  ) {
    return this.prismaService.mother.findFirst({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.MotherWhereUniqueInput,
    select?: Prisma.MotherSelect,
  ) {
    const data = await this.prismaService.mother.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.mother.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.mother.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.mother.count(filter)) > 0;
  }
}
