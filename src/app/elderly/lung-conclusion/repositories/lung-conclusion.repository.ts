import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.LungsConclutionWhereInput;
  orderBy?: Prisma.LungsConclutionOrderByWithRelationInput;
  cursor?: Prisma.LungsConclutionWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.LungsConclutionInclude;
};

@Injectable()
export class LungConclusionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.lungsConclution.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.lungsConclution.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.LungsConclutionCreateInput) {
    return this.prismaService.lungsConclution.create({ data });
  }

  public async update(
    where: Prisma.LungsConclutionWhereUniqueInput,
    data: Prisma.LungsConclutionUpdateInput,
  ) {
    return this.prismaService.lungsConclution.update({ where, data });
  }

  public async delete(where: Prisma.LungsConclutionWhereUniqueInput) {
    return this.prismaService.lungsConclution.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.LungsConclutionWhereUniqueInput,
    select?: Prisma.LungsConclutionSelect,
  ) {
    return this.prismaService.lungsConclution.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.LungsConclutionWhereUniqueInput,
    select?: Prisma.LungsConclutionSelect,
  ) {
    const data = await this.prismaService.lungsConclution.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.lungsConclution.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.lungsConclution.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.lungsConclution.count(filter)) > 0;
  }
}
