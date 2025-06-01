import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories';
import { CreateReportDto, UpdateReportDto, SearchReportDto } from '../dtos';
import { FileService } from 'src/app/file/services';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly filesService: FileService,
  ) {}

  public paginate(paginateDto: SearchReportDto, user: User) {
    const whereCondition: Prisma.ReportWhereInput = {
      userId: user.id,
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
  }

  public async destroy(id: string) {
    return this.reportRepository.delete({
      id,
    });
  }

  public async create(createReportDto: CreateReportDto, user: User) {
    const data: Prisma.ReportCreateInput = {
      reporter: createReportDto.reporter,
      phoneNumber: createReportDto.phoneNumber,
      childName: createReportDto.childName,
      gender: createReportDto.gender,
      childAddress: createReportDto.childAddress,
      observation: createReportDto.observation,
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    if (createReportDto.fileHousePicture) {
      const fileHousePicture = await this.filesService.upload({
        file: createReportDto.fileHousePicture,
        fileName: createReportDto.childName,
      });
      Object.assign(data, {
        fileHousePicture: {
          connect: {
            id: fileHousePicture.id,
          },
        },
      });
    }

    if (createReportDto.fileChildPicture) {
      const fileChildPicture = await this.filesService.upload({
        file: createReportDto.fileChildPicture,
        fileName: createReportDto.childName,
      });
      Object.assign(data, {
        fileChildPicture: {
          connect: {
            id: fileChildPicture.id,
          },
        },
      });
    }

    return this.reportRepository.create(data);
  }

  public async update(id: string, updateReportDto: UpdateReportDto) {
    const data: Prisma.ReportUpdateInput = {
      reporter: updateReportDto.reporter,
      phoneNumber: updateReportDto.phoneNumber,
      childName: updateReportDto.childName,
      gender: updateReportDto.gender,
      childAddress: updateReportDto.childAddress,
      observation: updateReportDto.observation,
    };

    if (updateReportDto.fileHousePicture) {
      const fileHousePicture = await this.filesService.upload({
        file: updateReportDto.fileHousePicture,
        fileName: updateReportDto.childName ?? '',
      });
      Object.assign(data, {
        fileHousePicture: {
          connect: {
            id: fileHousePicture.id,
          },
        },
      });
    }

    if (updateReportDto.fileChildPicture) {
      const fileChildPicture = await this.filesService.upload({
        file: updateReportDto.fileChildPicture,
        fileName: updateReportDto.childName ?? '',
      });
      Object.assign(data, {
        fileChildPicture: {
          connect: {
            id: fileChildPicture.id,
          },
        },
      });
    }

    return this.reportRepository.update({ id }, data);
  }
}
