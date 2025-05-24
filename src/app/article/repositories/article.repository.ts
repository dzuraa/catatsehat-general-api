import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  cursor?: Prisma.ArticleWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ArticleInclude;
};

@Injectable()
export class ArticleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.article.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.article.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ArticleCreateInput) {
    return this.prismaService.article.create({ data });
  }

  public async update(
    where: Prisma.ArticleWhereUniqueInput,
    data: Prisma.ArticleUpdateInput,
  ) {
    return this.prismaService.article.update({ where, data });
  }

  public async delete(where: Prisma.ArticleWhereUniqueInput) {
    return this.prismaService.article.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.ArticleWhereUniqueInput,
    select?: Prisma.ArticleSelect,
  ) {
    return this.prismaService.article.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ArticleWhereUniqueInput,
    select?: Prisma.ArticleSelect,
  ) {
    const data = await this.prismaService.article.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.article.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.article.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.article.count(filter)) > 0;
  }
}
