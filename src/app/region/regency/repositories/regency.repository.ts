import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.RegencyWhereInput;
  orderBy?: Prisma.RegencyOrderByWithRelationInput;
  cursor?: Prisma.RegencyWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.RegencyInclude;
};

@Injectable()
export class RegencyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.regency.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.regency.count({
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
    where: Prisma.RegencyWhereUniqueInput,
    select?: Prisma.RegencySelect,
  ) {
    return this.prismaService.regency.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.RegencyWhereUniqueInput,
    select?: Prisma.RegencySelect,
  ) {
    const data = await this.prismaService.regency.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async findMany(filter: Filter) {
    return this.prismaService.regency.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.regency.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.regency.count(filter)) > 0;
  }
}
