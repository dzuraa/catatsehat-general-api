import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.AdminWhereInput;
  orderBy?: Prisma.AdminOrderByWithRelationInput;
  cursor?: Prisma.AdminWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.AdminInclude;
  select?: Prisma.AdminSelect;
};

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.admin.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        select: filter?.include,
      }),
      this.prismaService.admin.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.AdminCreateInput) {
    return this.prismaService.admin.create({ data });
  }

  public async update(
    where: Prisma.AdminWhereUniqueInput,
    data: Prisma.AdminUpdateInput,
  ) {
    return this.prismaService.admin.update({ where, data });
  }

  public async delete(where: Prisma.AdminWhereUniqueInput) {
    return this.prismaService.admin.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.AdminWhereInput,
    include?: Prisma.AdminInclude,
  ) {
    return this.prismaService.admin.findFirst({ where, include });
  }

  public async firstOrThrow(
    where: Prisma.AdminWhereInput,
    select?: Prisma.AdminSelect,
  ) {
    const data = await this.prismaService.admin.findFirst({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  // public async findInclude(
  //   where: Prisma.AdminWhereInput,
  //   include?: Prisma.AdminInclude,
  // ) {
  //   return this.prismaService.admin.findFirst({ where, select });
  // }

  public async findUniqueOrThrow(
    where: Prisma.AdminWhereUniqueInput,
    select?: Prisma.AdminSelect,
  ) {
    const data = await this.prismaService.admin.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async findMany(filter: Filter) {
    return this.prismaService.admin.findMany(filter);
  }
}
