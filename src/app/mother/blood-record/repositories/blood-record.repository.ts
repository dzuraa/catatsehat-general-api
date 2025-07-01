import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.BloodRecordWhereInput;
  orderBy?: Prisma.BloodRecordOrderByWithRelationInput;
  cursor?: Prisma.BloodRecordWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.BloodRecordInclude;
};

@Injectable()
export class BloodRecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.bloodRecord.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.bloodRecord.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.BloodRecordCreateInput) {
    return this.prismaService.bloodRecord.create({ data });
  }

  public async update(
    where: Prisma.BloodRecordWhereUniqueInput,
    data: Prisma.BloodRecordUpdateInput,
  ) {
    return this.prismaService.bloodRecord.update({ where, data });
  }

  public async delete(where: Prisma.BloodRecordWhereUniqueInput) {
    return this.prismaService.bloodRecord.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.BloodRecordWhereUniqueInput,
    select?: Prisma.BloodRecordSelect,
  ) {
    return this.prismaService.bloodRecord.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.BloodRecordWhereUniqueInput,
    include?: Prisma.BloodRecordInclude,
  ) {
    const data = await this.prismaService.bloodRecord.findUnique({
      where,
      include,
    });
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.bloodRecord.findMany({
      ...filter,
      include: { ...filter.include, monthBlood: true },
    });
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.bloodRecord.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.bloodRecord.count(filter)) > 0;
  }
}
