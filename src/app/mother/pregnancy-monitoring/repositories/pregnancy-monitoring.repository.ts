import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.PregnancyMonitoringAnswerWhereInput;
  orderBy?: Prisma.PregnancyMonitoringAnswerOrderByWithRelationInput;
  cursor?: Prisma.PregnancyMonitoringAnswerWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.PregnancyMonitoringAnswerInclude;
};

@Injectable()
export class PregnancyMonitoringRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.pregnancyMonitoringAnswer.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.pregnancyMonitoringAnswer.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.PregnancyMonitoringAnswerCreateInput) {
    return this.prismaService.pregnancyMonitoringAnswer.create({ data });
  }

  public async update(
    where: Prisma.PregnancyMonitoringAnswerWhereUniqueInput,
    data: Prisma.PregnancyMonitoringAnswerUpdateInput,
  ) {
    return this.prismaService.pregnancyMonitoringAnswer.update({ where, data });
  }

  public async first(
    where: Prisma.PregnancyMonitoringAnswerWhereUniqueInput,
    select?: Prisma.PregnancyMonitoringAnswerSelect,
  ) {
    return this.prismaService.pregnancyMonitoringAnswer.findUnique({
      where,
      select,
    });
  }

  public async firstOrThrow(
    where: Prisma.PregnancyMonitoringAnswerWhereUniqueInput,
    select?: Prisma.PregnancyMonitoringAnswerSelect,
  ) {
    const data = await this.prismaService.pregnancyMonitoringAnswer.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.pregnancyMonitoringAnswer.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.pregnancyMonitoringAnswer.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (
      (await this.prismaService.pregnancyMonitoringAnswer.count(filter)) > 0
    );
  }
}
