import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type FilterRecord = {
  where?: Prisma.PostPartumRecordWhereInput;
  orderBy?: Prisma.PostPartumRecordOrderByWithRelationInput;
  cursor?: Prisma.PostPartumRecordWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.PostPartumRecordInclude;
};

@Injectable()
export class PostpartumRecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(
    paginateDto: PaginationQueryDto,
    filter?: FilterRecord,
  ) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.postPartumRecord.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.postPartumRecord.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.PostPartumRecordCreateInput) {
    return this.prismaService.postPartumRecord.create({ data });
  }

  public async update(
    where: Prisma.PostPartumRecordWhereUniqueInput,
    data: Prisma.PostPartumRecordUpdateInput,
  ) {
    return this.prismaService.postPartumRecord.update({ where, data });
  }

  public async first(
    where: Prisma.PostPartumRecordWhereUniqueInput,
    select?: Prisma.PostPartumRecordSelect,
  ) {
    return this.prismaService.postPartumRecord.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.PostPartumRecordWhereUniqueInput,
    select?: Prisma.PostPartumRecordSelect,
  ) {
    const data = await this.prismaService.postPartumRecord.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: FilterRecord) {
    return this.prismaService.postPartumRecord.findMany(filter);
  }

  public async count(filter: Omit<FilterRecord, 'include'>) {
    return this.prismaService.postPartumRecord.count(filter);
  }

  public async any(filter: Omit<FilterRecord, 'include'>) {
    return (await this.prismaService.postPartumRecord.count(filter)) > 0;
  }
}
