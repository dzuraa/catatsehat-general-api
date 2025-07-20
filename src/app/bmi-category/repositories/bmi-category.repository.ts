import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.BMICategoryWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.BMICategoryOrderByWithRelationInput>;
  cursor?: Prisma.BMICategoryWhereUniqueInput;
  take?: number;
  skip?: number;
};

@Injectable()
export class BmiCategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.bMICategory.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
      }),
      this.prismaService.bMICategory.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.BMICategoryCreateInput) {
    return this.prismaService.bMICategory.create({ data });
  }

  public async update(
    where: Prisma.BMICategoryWhereUniqueInput,
    data: Prisma.BMICategoryUpdateInput,
  ) {
    return this.prismaService.bMICategory.update({ where, data });
  }

  public async delete(where: Prisma.BMICategoryWhereUniqueInput) {
    return this.prismaService.bMICategory.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.BMICategoryWhereUniqueInput,
    select?: Prisma.BMICategorySelect,
  ) {
    return this.prismaService.bMICategory.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.BMICategoryWhereUniqueInput,
    select?: Prisma.BMICategorySelect,
  ) {
    const data = await this.prismaService.bMICategory.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.bMICategory.findMany(filter);
  }
}
