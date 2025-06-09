import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.PostPartumAnswerWhereInput;
  orderBy?: Prisma.PostPartumAnswerOrderByWithRelationInput;
  cursor?: Prisma.PostPartumAnswerWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.PostPartumAnswerInclude;
};

@Injectable()
export class PostPartumRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.postPartumAnswer.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.postPartumAnswer.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.PostPartumAnswerCreateInput) {
    return this.prismaService.postPartumAnswer.create({ data });
  }

  public async update(
    where: Prisma.PostPartumAnswerWhereUniqueInput,
    data: Prisma.PostPartumAnswerUpdateInput,
  ) {
    return this.prismaService.postPartumAnswer.update({ where, data });
  }

  public async first(
    where: Prisma.PostPartumAnswerWhereUniqueInput,
    select?: Prisma.PostPartumAnswerSelect,
  ) {
    return this.prismaService.postPartumAnswer.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.PostPartumAnswerWhereUniqueInput,
    include?: Prisma.PostPartumAnswerInclude,
  ) {
    const data = await this.prismaService.postPartumAnswer.findUnique({
      where,
      include,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.postPartumAnswer.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.postPartumAnswer.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.postPartumAnswer.count(filter)) > 0;
  }
}
