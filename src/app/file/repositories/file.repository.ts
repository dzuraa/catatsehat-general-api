import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.FileWhereInput;
  orderBy?: Prisma.FileOrderByWithRelationInput;
  cursor?: Prisma.FileWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.FileInclude;
};

@Injectable()
export class FileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(data: Prisma.FileCreateInput) {
    return this.prismaService.file.create({ data });
  }

  async createMany(data: Prisma.FileCreateInput[]) {
    return this.prismaService.$transaction(
      data.map((file) => this.prismaService.file.create({ data: file })),
    );
  }

  public async update(
    where: Prisma.FileWhereUniqueInput,
    data: Prisma.FileUpdateInput,
  ) {
    return this.prismaService.file.update({ where, data });
  }

  async findById(id: string) {
    return this.prismaService.file.findUnique({
      where: { id },
    });
  }
}
