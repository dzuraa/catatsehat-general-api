import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.PregnancyMonitoringQuestionWhereInput;
  orderBy?: Prisma.PregnancyMonitoringQuestionOrderByWithRelationInput;
  cursor?: Prisma.PregnancyMonitoringQuestionWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.PregnancyMonitoringQuestionInclude;
};

@Injectable()
export class PregnancyMonitoringQuestionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.pregnancyMonitoringQuestion.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.pregnancyMonitoringQuestion.count({
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
    where: Prisma.PregnancyMonitoringQuestionWhereUniqueInput,
    select?: Prisma.PregnancyMonitoringQuestionSelect,
  ) {
    return this.prismaService.pregnancyMonitoringQuestion.findUnique({
      where,
      select,
    });
  }

  public async firstOrThrow(
    where: Prisma.PregnancyMonitoringQuestionWhereUniqueInput,
    select?: Prisma.PregnancyMonitoringQuestionSelect,
  ) {
    const data =
      await this.prismaService.pregnancyMonitoringQuestion.findUnique({
        where,
        select,
      });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.pregnancyMonitoringQuestion.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.pregnancyMonitoringQuestion.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (
      (await this.prismaService.pregnancyMonitoringQuestion.count(filter)) > 0
    );
  }
}
