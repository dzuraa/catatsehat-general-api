import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.WeekPregnancyMonitoringWhereInput;
  orderBy?: Prisma.WeekPregnancyMonitoringOrderByWithRelationInput;
  cursor?: Prisma.WeekPregnancyMonitoringWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.WeekPregnancyMonitoringInclude;
};

@Injectable()
export class WeekPregnancyMonitoringRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.weekPregnancyMonitoring.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.weekPregnancyMonitoring.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async first(
    where: Prisma.WeekPregnancyMonitoringWhereUniqueInput,
    select?: Prisma.WeekPregnancyMonitoringSelect,
  ) {
    return this.prismaService.weekPregnancyMonitoring.findUnique({
      where,
      select,
    });
  }

  public async firstOrThrow(
    where: Prisma.WeekPregnancyMonitoringWhereUniqueInput,
    select?: Prisma.WeekPregnancyMonitoringSelect,
  ) {
    const data = await this.prismaService.weekPregnancyMonitoring.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.weekPregnancyMonitoring.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.weekPregnancyMonitoring.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.weekPregnancyMonitoring.count(filter)) > 0;
  }
}
