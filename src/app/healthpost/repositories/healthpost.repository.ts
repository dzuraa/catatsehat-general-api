import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.HealthPostWhereInput;
  orderBy?: Prisma.HealthPostOrderByWithRelationInput;
  cursor?: Prisma.HealthPostWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.HealthPostInclude;
};

@Injectable()
export class HealthPostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.healthPost.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.healthPost.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.HealthPostCreateInput) {
    return this.prismaService.healthPost.create({ data });
  }

  public async update(
    where: Prisma.HealthPostWhereUniqueInput,
    data: Prisma.HealthPostUpdateInput,
  ) {
    return this.prismaService.healthPost.update({ where, data });
  }

  public async delete(where: Prisma.HealthPostWhereUniqueInput) {
    return this.prismaService.healthPost.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.HealthPostWhereUniqueInput,
    select?: Prisma.HealthPostSelect,
  ) {
    return this.prismaService.healthPost.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.HealthPostWhereUniqueInput,
    include?: Prisma.HealthPostInclude,
  ) {
    const data = await this.prismaService.healthPost.findUnique({
      where,
      include,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async findAll(filter: Filter) {
    return this.prismaService.healthPost.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.healthPost.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.healthPost.count(filter)) > 0;
  }
}
