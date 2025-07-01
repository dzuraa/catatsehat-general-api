import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.MasterDataLungsWhereInput;
  orderBy?: Prisma.MasterDataLungsOrderByWithRelationInput;
  cursor?: Prisma.MasterDataLungsWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.MasterDataLungsInclude;
};

@Injectable()
export class MasterDataLungsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.masterDataLungs.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.masterDataLungs.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.MasterDataLungsCreateInput) {
    return this.prismaService.masterDataLungs.create({ data });
  }

  public async update(
    where: Prisma.MasterDataLungsWhereUniqueInput,
    data: Prisma.MasterDataLungsUpdateInput,
  ) {
    return this.prismaService.masterDataLungs.update({ where, data });
  }

  public async delete(where: Prisma.MasterDataLungsWhereUniqueInput) {
    return this.prismaService.masterDataLungs.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.MasterDataLungsWhereUniqueInput,
    select?: Prisma.MasterDataLungsSelect,
  ) {
    return this.prismaService.masterDataLungs.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.MasterDataLungsWhereUniqueInput,
    select?: Prisma.MasterDataLungsSelect,
  ) {
    const data = await this.prismaService.masterDataLungs.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.masterDataLungs.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.masterDataLungs.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.masterDataLungs.count(filter)) > 0;
  }
}
