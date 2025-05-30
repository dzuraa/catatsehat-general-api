import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  cursor?: Prisma.UserWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.UserInclude;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        ...filter,
        // include: {
        //   regency: true,
        //   district: true,
        //   province: true,
        //   subDistrict: true,
        // },
      }),
      this.prismaService.user.count(),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data });
  }

  public async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  public async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Partial<Prisma.UserWhereUniqueInput>,
    include?: Prisma.UserInclude,
  ) {
    return this.prismaService.user.findFirst({
      where,
      include: {
        otp: {
          take: 1,
        },
        ...include,
      },
    });
  }

  public async firstOrThrow(
    where: Partial<Prisma.UserWhereUniqueInput>,
    include?: Prisma.UserInclude,
  ) {
    const data = await this.prismaService.user.findFirst({
      where,
      include: {
        otp: {
          take: 1,
        },
        ...include,
      },
    });
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.prismaService.user.findMany(filter);
  }

  public async findUniqueOrThrow(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    const data = await this.prismaService.user.findUnique({ where, select });
    if (!data) throw new Error('err.not_found');
    return data;
  }

  public async findUnique(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return this.prismaService.user.findUnique({ where, select });
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.user.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.user.count(filter)) > 0;
  }
}
