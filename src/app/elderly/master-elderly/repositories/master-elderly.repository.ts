import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ElderlyWhereInput;
  orderBy?: Prisma.ElderlyOrderByWithRelationInput;
  cursor?: Prisma.ElderlyWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ElderlyInclude;
};

@Injectable()
export class MasterElderlyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.elderly.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.elderly.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ElderlyCreateInput) {
    return this.prismaService.elderly.create({ data });
  }

  public async update(
    where: Prisma.ElderlyWhereUniqueInput,
    data: Prisma.ElderlyUpdateInput,
  ) {
    return this.prismaService.elderly.update({ where, data });
  }

  public async delete(where: Prisma.ElderlyWhereUniqueInput) {
    return this.prismaService.elderly.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.ElderlyWhereUniqueInput,
    select?: Prisma.ElderlySelect,
  ) {
    return this.prismaService.elderly.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ElderlyWhereUniqueInput,
    select?: Prisma.ElderlySelect,
  ) {
    const data = await this.prismaService.elderly.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.elderly.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.elderly.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.elderly.count(filter)) > 0;
  }
}
