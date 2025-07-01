import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ChildVaccineWhereInput;
  orderBy?: Prisma.ChildVaccineOrderByWithRelationInput;
  cursor?: Prisma.ChildVaccineWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ChildVaccineInclude;
};

@Injectable()
export class ChildVaccineRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.childVaccine.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.childVaccine.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ChildVaccineCreateInput) {
    return this.prismaService.childVaccine.create({ data });
  }

  public async update(
    where: Prisma.ChildVaccineWhereUniqueInput,
    data: Prisma.ChildVaccineUpdateInput,
  ) {
    return this.prismaService.childVaccine.update({ where, data });
  }

  public async first(
    where: Prisma.ChildVaccineWhereUniqueInput,
    select?: Prisma.ChildVaccineSelect,
  ) {
    return this.prismaService.childVaccine.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ChildVaccineWhereUniqueInput,
    select?: Prisma.ChildVaccineSelect,
  ) {
    const data = await this.prismaService.childVaccine.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Prisma.ChildVaccineFindManyArgs) {
    return this.prismaService.childVaccine.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.childVaccine.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.childVaccine.count(filter)) > 0;
  }
}
