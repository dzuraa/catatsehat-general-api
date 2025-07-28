import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.LungsWhereInput;
  orderBy?: Prisma.LungsOrderByWithRelationInput;
  cursor?: Prisma.LungsWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.LungsInclude;
};

@Injectable()
export class LungsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.lungs.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.lungs.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.LungsCreateInput) {
    return this.prismaService.lungs.create({ data });
  }

  public async update(
    where: Prisma.LungsWhereUniqueInput,
    data: Prisma.LungsUpdateInput,
  ) {
    return this.prismaService.lungs.update({ where, data });
  }

  public async delete(where: Prisma.LungsWhereUniqueInput) {
    return this.prismaService.lungs.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.LungsWhereUniqueInput,
    select?: Prisma.LungsSelect,
  ) {
    return this.prismaService.lungs.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.LungsWhereUniqueInput,
    select?: Prisma.LungsSelect,
  ) {
    const data = await this.prismaService.lungs.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.lungs.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.lungs.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.lungs.count(filter)) > 0;
  }

  public async getData(id: string) {
    try {
      return this.prismaService.lungs.findUnique({
        where: { id },
        include: {
          elderly: true,
          lungsConclution: true,
          lungsPivot: {
            include: {
              masterDataLungs: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
