import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ChildVaccineStageWhereInput;
  orderBy?: Prisma.ChildVaccineStageOrderByWithRelationInput;
  cursor?: Prisma.ChildVaccineStageWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ChildVaccineStageInclude;
  select?: Prisma.ChildVaccineStageSelect;
};

@Injectable()
export class ChildVaccineStageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.childVaccineStage.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.childVaccineStage.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ChildVaccineStageCreateInput) {
    return this.prismaService.childVaccineStage.create({ data });
  }

  public async update(
    where: Prisma.ChildVaccineStageWhereUniqueInput,
    data: Prisma.ChildVaccineStageUpdateInput,
  ) {
    return this.prismaService.childVaccineStage.update({ where, data });
  }

  public async first(
    where: Prisma.ChildVaccineStageWhereUniqueInput,
    select?: Prisma.ChildVaccineStageSelect,
  ) {
    return this.prismaService.childVaccineStage.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.ChildVaccineStageWhereUniqueInput,
    select?: Prisma.ChildVaccineStageSelect,
  ) {
    const data = await this.prismaService.childVaccineStage.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('Data not found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.childVaccineStage.findMany(filter);
  }
}
