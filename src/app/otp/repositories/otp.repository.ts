import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';
import { Otp } from '@prisma/client';

export type Filter = {
  where?: Prisma.OtpWhereInput;
  orderBy?: Prisma.OtpOrderByWithRelationInput;
  cursor?: Prisma.OtpWhereUniqueInput;
  take?: number;
  skip?: number;
};

@Injectable()
export class OtpRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.otp.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
      }),
      this.prismaService.otp.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.OtpCreateArgs): Promise<Otp> {
    return this.prismaService.otp.create(data);
  }

  public async update(
    where: Prisma.OtpWhereUniqueInput,
    data: Prisma.OtpUpdateInput,
  ) {
    return this.prismaService.otp.update({
      where,
      data,
    });
  }

  public async findUnique(
    where: Prisma.OtpWhereUniqueInput,
  ): Promise<Otp | null> {
    return this.prismaService.otp.findUnique({
      where,
    });
  }

  public async first(
    where: Prisma.OtpWhereUniqueInput,
    select?: Prisma.OtpSelect,
  ) {
    return this.prismaService.otp.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.OtpWhereUniqueInput,
    select?: Prisma.OtpSelect,
  ) {
    const data = await this.prismaService.otp.findUnique({ where, select });
    if (!data) throw new Error('err.not_found');
    return data;
  }

  public async findFirst(
    where: Prisma.OtpWhereInput,
    select?: Prisma.OtpSelect,
  ) {
    return this.prismaService.otp.findFirst({ where, select });
  }

  public async find(filter: Prisma.OtpFindManyArgs): Promise<Otp[]> {
    return this.prismaService.otp.findMany(filter);
  }

  async createOtp(userId: string, otp: string, expiresAt: Date): Promise<Otp> {
    return this.prismaService.otp.create({
      data: {
        userId,
        otp,
        expiresAt,
      },
    });
  }

  async findActiveOtp(userId: string): Promise<Otp | null> {
    return this.prismaService.otp.findFirst({
      where: {
        userId,
        isVerified: false,
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  }

  async markOtpAsUsed(otpId: string): Promise<Otp> {
    return this.prismaService.otp.update({
      where: { id: otpId },
      data: { isVerified: true, otp: '' },
    });
  }
}
