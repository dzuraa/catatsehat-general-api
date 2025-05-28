import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ChildrenWhereInput;
  orderBy?: Prisma.ChildrenOrderByWithRelationInput;
  cursor?: Prisma.ChildrenWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ChildrenInclude;
};

@Injectable()
export class ChildrenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.children.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.children.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ChildrenCreateInput) {
    return this.prismaService.children.create({ data });
  }

  public async update(
    where: Prisma.ChildrenWhereUniqueInput,
    data: Prisma.ChildrenUpdateInput,
  ) {
    return this.prismaService.children.update({ where, data });
  }

  public async delete(where: Prisma.ChildrenWhereUniqueInput) {
    return this.prismaService.children.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.ChildrenWhereUniqueInput,
    select?: Prisma.ChildrenSelect,
  ) {
    return this.prismaService.children.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ChildrenWhereUniqueInput,
    select?: Prisma.ChildrenSelect,
  ) {
    const data = await this.prismaService.children.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.children.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.children.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.children.count(filter)) > 0;
  }
}
