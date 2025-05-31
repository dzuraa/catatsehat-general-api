import { Injectable } from '@nestjs/common';
import { Gender, Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.CheckupChildrenWhereInput;
  orderBy?: Prisma.CheckupChildrenOrderByWithRelationInput;
  cursor?: Prisma.CheckupChildrenWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.CheckupChildrenInclude;
};

interface Children {
  id: string;
  name: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  height: number;
  weight: number;
  gender?: Gender;
}

interface CheckupChildrenWithRelations {
  id: string;
  children?: Pick<Children, 'id' | 'dateOfBirth' | 'name'> | null;
  healthPost?: {
    id: string;
    name: string;
  } | null;
}

@Injectable()
export class CheckupChildrenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.checkupChildren.findMany({
        skip: filter?.skip ?? (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.checkupChildren.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.CheckupChildrenCreateInput) {
    return this.prismaService.checkupChildren.create({ data });
  }

  public async update(
    where: Prisma.CheckupChildrenWhereUniqueInput,
    data: Prisma.CheckupChildrenUpdateInput,
  ) {
    return this.prismaService.checkupChildren.update({ where, data });
  }

  public async delete(where: Prisma.CheckupChildrenWhereUniqueInput) {
    return this.prismaService.checkupChildren.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.CheckupChildrenWhereUniqueInput,
    include?: Prisma.CheckupChildrenInclude,
  ): Promise<CheckupChildrenWithRelations | null> {
    return this.prismaService.checkupChildren.findUnique({ where, include });
  }

  public async firstOrThrow(
    where: Prisma.CheckupChildrenWhereUniqueInput,
    include?: Prisma.CheckupChildrenInclude,
  ) {
    const data = await this.prismaService.checkupChildren.findUnique({
      where,
      include,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.checkupChildren.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.checkupChildren.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.checkupChildren.count(filter)) > 0;
  }
}
