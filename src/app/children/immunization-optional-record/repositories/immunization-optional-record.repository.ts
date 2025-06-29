import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ImmunizationOptionalRecordWhereInput;
  orderBy?: Prisma.ImmunizationOptionalRecordOrderByWithRelationInput;
  cursor?: Prisma.ImmunizationOptionalRecordWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ImmunizationOptionalRecordInclude;
};

@Injectable()
export class ImmunizationOptionalRecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.immunizationOptionalRecord.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.immunizationOptionalRecord.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ImmunizationOptionalRecordCreateInput) {
    return this.prismaService.immunizationOptionalRecord.create({ data });
  }

  public async update(
    where: Prisma.ImmunizationOptionalRecordWhereUniqueInput,
    data: Prisma.ImmunizationOptionalRecordUpdateInput,
  ) {
    return this.prismaService.immunizationOptionalRecord.update({
      where,
      data,
    });
  }

  public async delete(
    where: Prisma.ImmunizationOptionalRecordWhereUniqueInput,
  ) {
    return this.prismaService.immunizationOptionalRecord.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.ImmunizationOptionalRecordWhereUniqueInput,
    select?: Prisma.ImmunizationOptionalRecordSelect,
  ) {
    return this.prismaService.immunizationOptionalRecord.findUnique({
      where,
      select,
    });
  }

  public async firstOrThrow(
    where: Prisma.ImmunizationOptionalRecordWhereUniqueInput,
    include?: Prisma.ImmunizationOptionalRecordInclude,
  ) {
    const data = await this.prismaService.immunizationOptionalRecord.findUnique(
      { where, include },
    );
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.immunizationOptionalRecord.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.immunizationOptionalRecord.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (
      (await this.prismaService.immunizationOptionalRecord.count(filter)) > 0
    );
  }
}
