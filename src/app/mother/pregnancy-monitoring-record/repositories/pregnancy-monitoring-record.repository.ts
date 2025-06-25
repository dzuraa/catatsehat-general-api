import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.PregnancyMonitoringRecordWhereInput;
  orderBy?: Prisma.PregnancyMonitoringRecordOrderByWithRelationInput;
  cursor?: Prisma.PregnancyMonitoringRecordWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.PregnancyMonitoringRecordInclude;
};

@Injectable()
export class PregnancyMonitoringRecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.pregnancyMonitoringRecord.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.pregnancyMonitoringRecord.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.PregnancyMonitoringRecordCreateInput) {
    return this.prismaService.pregnancyMonitoringRecord.create({ data });
  }

  public async update(
    where: Prisma.PregnancyMonitoringRecordWhereUniqueInput,
    data: Prisma.PregnancyMonitoringRecordUpdateInput,
  ) {
    return this.prismaService.pregnancyMonitoringRecord.update({ where, data });
  }

  public async delete(where: Prisma.PregnancyMonitoringRecordWhereUniqueInput) {
    return this.prismaService.pregnancyMonitoringRecord.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.PregnancyMonitoringRecordWhereUniqueInput,
    select?: Prisma.PregnancyMonitoringRecordSelect,
  ) {
    return this.prismaService.pregnancyMonitoringRecord.findUnique({
      where,
      select,
    });
  }

  public async firstOrThrow(
    where: Prisma.PregnancyMonitoringRecordWhereUniqueInput,
    include?: Prisma.PregnancyMonitoringRecordInclude,
  ) {
    const data = await this.prismaService.pregnancyMonitoringRecord.findUnique({
      where,
      include,
    });
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.pregnancyMonitoringRecord.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.pregnancyMonitoringRecord.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (
      (await this.prismaService.pregnancyMonitoringRecord.count(filter)) > 0
    );
  }
}
