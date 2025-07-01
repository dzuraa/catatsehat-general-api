import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.ImmunizationRecordWhereInput;
  orderBy?: Prisma.ImmunizationRecordOrderByWithRelationInput;
  cursor?: Prisma.ImmunizationRecordWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.ImmunizationRecordInclude;
};

@Injectable()
export class ImmunizationRecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.immunizationRecord.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.immunizationRecord.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.ImmunizationRecordCreateInput) {
    return this.prismaService.immunizationRecord.create({ data });
  }

  public async createMany(data: Prisma.ImmunizationRecordCreateInput[]) {
    return this.prismaService.immunizationRecord.createMany({ data });
  }

  public async update(
    where: Prisma.ImmunizationRecordWhereUniqueInput,
    data: Prisma.ImmunizationRecordUpdateInput,
  ) {
    return this.prismaService.immunizationRecord.update({ where, data });
  }

  public async delete(where: Prisma.ImmunizationRecordWhereUniqueInput) {
    return this.prismaService.immunizationRecord.update({
      where,
      data: { deletedAt: new Date() },
      include: {
        vaccine: true,
        vaccineStage: true,
        children: true,
      },
    });
  }

  public async first(
    where: Prisma.ImmunizationRecordWhereUniqueInput,
    include?: Prisma.ImmunizationRecordInclude,
  ) {
    return this.prismaService.immunizationRecord.findUnique({ where, include });
  }

  public async firstOrThrow<T extends Prisma.ImmunizationRecordInclude>(
    where: Prisma.ImmunizationRecordWhereUniqueInput,
    include?: T,
  ): Promise<Prisma.ImmunizationRecordGetPayload<{ include: T }>> {
    const data = await this.prismaService.immunizationRecord.findUnique({
      where,
      include,
    });
    if (!data) throw new Error('err.not_found');
    return data as Prisma.ImmunizationRecordGetPayload<{ include: T }>;
  }

  public async find(filter: Filter) {
    return this.prismaService.immunizationRecord.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.immunizationRecord.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.immunizationRecord.count(filter)) > 0;
  }
}
