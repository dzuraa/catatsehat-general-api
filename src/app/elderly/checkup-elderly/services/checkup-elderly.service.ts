import { Injectable } from '@nestjs/common';
import { CheckupElderlyRepository } from '../repositories';
import { CreateCheckupElderlyDto } from '../dtos';
import { Admin, BMIStatus, CheckupStatus } from '@prisma/client';
import { BMI_RANGES_ELDERLY } from 'src/common/constants/bmi.constant';
import { SearchCheckupElderlyDto } from '../dtos/search-checkup-elderly.dto';
import { PrismaService } from '@/platform/database/services/prisma.service';
import { FileService } from '@/app/file/services';
import { DateTime } from 'luxon';
import { forkJoin, from, map, switchMap } from 'rxjs';
import { ExportCheckupDto } from '../dtos/export-checkup.dto';
import * as ExcelJS from 'exceljs';

type CheckupElderlyWhereInput = {
  id?: string;
  deletedAt?: Date | null;
  attend?: {
    gte?: Date;
    lte?: Date;
  };
  OR?: Array<{
    elderly?: {
      name?: {
        contains?: string;
        mode?: 'insensitive';
      };
    };
    healthPost?: {
      name?: {
        contains?: string;
        mode?: 'insensitive';
      };
    };
  }>;
};

type CheckupElderlyCreateInput = {
  height: number;
  weight: number;
  bloodTension: number;
  bloodSugar: number;
  attend: Date;
  bmi: number;
  bmiStatus: BMIStatus;
  status: CheckupStatus;
  healthPost?: {
    connect: {
      id: string;
    };
  };
};

type CheckupElderlyUpdateInput = {
  name?: string;
  height?: number;
  weight?: number;
  bloodTension?: number;
  bloodSugar?: number;
  attend?: Date;
  bmi?: number;
  bmiStatus?: BMIStatus;
  healthPost?: {
    connect: {
      id: string;
    };
  };
};

@Injectable()
export class CheckupElderlyService {
  constructor(
    private readonly checkupElderlyRepository: CheckupElderlyRepository,
    private readonly fileService: FileService,
    private readonly prisma: PrismaService,
  ) {}

  public calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public getBMIStatus(bmi: number): BMIStatus {
    const bmiRange = BMI_RANGES_ELDERLY.find(
      (range) => bmi >= range.min && bmi <= range.max,
    );

    if (!bmiRange) {
      throw new Error('BMI range not found');
    }
    return bmiRange.status;
  }

  public paginate(paginateDto: SearchCheckupElderlyDto) {
    const whereCondition: CheckupElderlyWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          elderly: {
            name: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        },
        {
          healthPost: {
            name: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Add date filtering
    if (paginateDto.date) {
      const start = DateTime.fromISO(paginateDto.date);
      const end = DateTime.fromISO(paginateDto.date);
      const startDate = start.startOf('day').toUTC().toJSDate();
      const endDate = end.endOf('day').toUTC().toJSDate();

      whereCondition.attend = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.checkupElderlyRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        healthPost: true,
        elderly: true,
        fileDiagnosed: true,
      },
    });
  }

  public async detail(id: string) {
    try {
      const result = await this.checkupElderlyRepository.find({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          healthPost: true,
        },
      });

      const lungs = await this.prisma.lungs.findFirst({
        where: {
          elderlyId: result[0].elderlyId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          lungsConclution: true,
        },
      });

      if (!result || result.length === 0) {
        throw new Error('Checkup elderly not found');
      }

      return Object.assign(result[0], { lungs });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.checkupElderlyRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createCheckupElderlyDto: CreateCheckupElderlyDto,
    user?: Admin,
  ) {
    const bmi = this.calculateBmi(
      createCheckupElderlyDto.height,
      createCheckupElderlyDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi);

    const data: CheckupElderlyCreateInput = {
      height: createCheckupElderlyDto.height,
      weight: createCheckupElderlyDto.weight,
      bloodTension: createCheckupElderlyDto.bloodTension,
      bloodSugar: createCheckupElderlyDto.bloodSugar,
      attend: new Date(),
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
    };

    if (createCheckupElderlyDto.fileDiagnosed) {
      const fileDiagnosed = await this.fileService.upload({
        file: createCheckupElderlyDto.fileDiagnosed,
        fileName: `diagnosed-${createCheckupElderlyDto.elderlyId}`,
      });

      data.status = CheckupStatus.VERIFIED;
      Object.assign(data, {
        fileDiagnosed: {
          connect: {
            id: fileDiagnosed.id,
          },
        },
      });
    }

    const admin = await this.prisma.admin.findUnique({
      where: {
        id: user?.id,
      },
      include: {
        healthPost: true,
      },
    });

    if (admin && admin.healthPostId) {
      Object.assign(data, {
        admin: {
          connect: {
            id: user?.id,
          },
        },
        healthPost: admin.healthPostId && {
          connect: {
            id: admin.healthPostId,
          },
        },
      });
    }

    return await this.checkupElderlyRepository.create({
      ...data,
      elderly: {
        connect: {
          id: createCheckupElderlyDto.elderlyId,
        },
      },
    });
  }

  public async update(
    id: string,
    updateCheckupElderlyDto: Partial<CreateCheckupElderlyDto>,
  ) {
    try {
      let bmi: number | undefined;
      let bmiStatus: BMIStatus | undefined;
      if (updateCheckupElderlyDto.height && updateCheckupElderlyDto.weight) {
        bmi = this.calculateBmi(
          updateCheckupElderlyDto.height,
          updateCheckupElderlyDto.weight,
        );
        bmiStatus = this.getBMIStatus(bmi);
      }

      const data: CheckupElderlyUpdateInput = {
        height: updateCheckupElderlyDto.height,
        weight: updateCheckupElderlyDto.weight,
        bloodTension: updateCheckupElderlyDto.bloodTension,
        bloodSugar: updateCheckupElderlyDto.bloodSugar,
        attend: updateCheckupElderlyDto.attend
          ? new Date(updateCheckupElderlyDto.attend)
          : undefined,
        bmi,
        bmiStatus,
      };

      return await this.checkupElderlyRepository.update({ id }, data);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  export(searchDto: ExportCheckupDto) {
    const elderlyCheckups$ = from(
      this.prisma.checkupElderly.findMany({
        where: {
          ...(searchDto.startDate && {
            createdAt: { gte: searchDto.startDate },
          }),
          ...(searchDto.endDate && { createdAt: { lte: searchDto.endDate } }),
        },
        include: {
          elderly: true,
          fileDiagnosed: true,
        },
      }),
    );

    const lungs$ = from(
      this.prisma.lungs.findMany({
        where: {
          ...(searchDto.startDate && {
            createdAt: { gte: searchDto.startDate },
          }),
          ...(searchDto.endDate && { createdAt: { lte: searchDto.endDate } }),
        },
        include: {
          lungsConclution: true,
        },
      }),
    );

    return forkJoin([elderlyCheckups$, lungs$])
      .pipe(
        map(([elderlyData, lungsData]) => {
          return {
            elderlyCheckups: elderlyData.map((item) => ({
              ...item,
              createdAt: item.createdAt.toISOString(),
              lungs: lungsData.find(
                (lung) => lung.elderlyId === item.elderlyId,
              ),
            })),
          };
        }),
      )
      .pipe(
        switchMap((data) => {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Elderly Checkup Data');

          worksheet.columns = [
            { header: 'Nama', key: 'name', width: 20 },
            { header: 'Umur (Tahun)', key: 'age', width: 15 },
            { header: 'Jenis Kelamin', key: 'gender', width: 15 },
            { header: 'Tinggi Badan (cm)', key: 'height', width: 20 },
            { header: 'Berat Badan (kg)', key: 'weight', width: 20 },
            { header: 'Tekanan Darah (mmHg)', key: 'bloodTension', width: 20 },
            { header: 'Gula Darah (mg/dL)', key: 'bloodSugar', width: 20 },
            { header: 'Paru-Paru', key: 'lungs', width: 30 },
            { header: 'Indeks Masa Tubuh', key: 'bmi', width: 30 },
            { header: 'Surat Rujukan', key: 'referralLetter', width: 20 },
          ];

          worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'A6C9F5' }, // Light blue background
            };
            cell.font = { bold: true };
          });

          worksheet.columns.forEach((column) => {
            column.alignment = { horizontal: 'left' };
          });

          const countAge = (date: Date) => {
            const birthDate = DateTime.fromJSDate(date);
            const now = DateTime.now();
            return now.diff(birthDate, 'years').years || 0;
          };

          data.elderlyCheckups.forEach((item) => {
            worksheet.addRow({
              name: item.elderly?.name,
              age: countAge(item.elderly?.dateOfBirth as Date).toFixed() ?? 0,
              gender:
                item.elderly?.gender && item.elderly?.gender === 'MALE'
                  ? 'Laki-laki'
                  : 'Perempuan',
              height: item.height.toFixed(),
              weight: item.weight.toFixed(),
              bloodTension: item.bloodTension,
              bloodSugar: item.bloodSugar,
              lungs: item.lungs?.lungsConclution?.conclusion,
              bmi: item.bmi,
              referralLetter: item.fileDiagnosed?.path,
            });
          });

          return workbook.xlsx.writeBuffer();
        }),
      );
  }
}
