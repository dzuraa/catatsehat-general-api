import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.VaccineStageWhereInput;
  orderBy?: Prisma.VaccineStageOrderByWithRelationInput;
  cursor?: Prisma.VaccineStageWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.VaccineStageInclude;
};

@Injectable()
export class VaccineStageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.vaccineStage.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.vaccineStage.count({
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
    where: Prisma.VaccineStageWhereUniqueInput,
    select?: Prisma.VaccineStageSelect,
  ) {
    return this.prismaService.vaccineStage.findUnique({ where, select });
  }

  public async findFirst(filter: Prisma.VaccineStageFindFirstArgs) {
    return this.prismaService.vaccineStage.findFirst(filter);
  }

  public async firstOrThrow(
    where: Prisma.VaccineStageWhereUniqueInput,
    select?: Prisma.VaccineStageSelect,
  ) {
    const data = await this.prismaService.vaccineStage.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.vaccineStage.findMany(filter);
  }

  public async findMany(filter: Prisma.VaccineStageFindManyArgs) {
    return this.prismaService.vaccineStage.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.vaccineStage.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.vaccineStage.count(filter)) > 0;
  }
}
