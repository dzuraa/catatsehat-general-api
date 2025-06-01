import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ReportWhereInput;
  orderBy?: Prisma.ReportOrderByWithRelationInput;
  cursor?: Prisma.ReportWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ReportInclude;
};

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.report.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.report.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ReportCreateInput) {
    return this.prismaService.report.create({ data });
  }

  public async update(
    where: Prisma.ReportWhereUniqueInput,
    data: Prisma.ReportUpdateInput,
  ) {
    return this.prismaService.report.update({ where, data });
  }

  public async delete(where: Prisma.ReportWhereUniqueInput) {
    return this.prismaService.report.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.ReportWhereUniqueInput,
    select?: Prisma.ReportSelect,
  ) {
    return this.prismaService.report.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ReportWhereUniqueInput,
    include?: Prisma.ReportInclude,
  ) {
    const data = await this.prismaService.report.findUnique({ where, include });
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.report.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.report.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.report.count(filter)) > 0;
  }
}
