import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SearchReportDto } from '../dtos';
import { ReportRepository } from '../repositories';

@Injectable()
export class ReportAdminService {
  constructor(private readonly reportRepository: ReportRepository) {}

  public paginate(paginateDto: SearchReportDto) {
    const whereCondition: Prisma.ReportWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          childName: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          reporter: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          phoneNumber: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.reportRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        fileHousePicture: true,
        fileChildPicture: true,
      },
    });
  }

  public detail(id: string) {
    try {
      return this.reportRepository.firstOrThrow(
        {
          id,
          deletedAt: null,
        },
        {
          fileHousePicture: true,
          fileChildPicture: true,
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
