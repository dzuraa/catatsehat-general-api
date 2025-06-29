import { Injectable } from '@nestjs/common';
import {
  Admin,
  BMIStatus,
  CheckupStatus,
  OwnerType,
  Prisma,
} from '@prisma/client';
import { AdminRepository } from 'src/app/admin/repositories';
// import { FilesService } from '@src/app/files/services';
// import { HealthPostsRepository } from '@src/app/healthposts/repositories';
import { HealthPostRepository } from '@/app/healthpost/repositories';
import { BMI_RANGES_MOTHER } from 'src/common/constants/bmi.constant';
import { MotherRepository } from '../../mother/repositories';
import { CreateCheckupMothersAdminDto, UpdateCheckupMotherDto } from '../dtos';
import { CheckupMotherSearchDto } from '../dtos/search-checkup-mother.dto';
import { CheckupMotherRepository } from '../repositories';
import { DateTime } from 'luxon';
import { translateBMI } from '@/common/helpers/bmi-status.helper';
import { Buffer } from 'exceljs';
import ExcelJS from 'exceljs';

@Injectable()
export class CheckupMothersAdminService {
  constructor(
    private readonly checkupMotherRepository: CheckupMotherRepository,
    // private readonly filesService: FilesService,
    private readonly healthPostRepository: HealthPostRepository,
    private readonly adminRepository: AdminRepository,
    private readonly motherRepository: MotherRepository,
  ) {}

  public calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public getBMIStatus(bmi: number): BMIStatus {
    const bmiRange = BMI_RANGES_MOTHER.find(
      (range) => bmi >= range.min && bmi <= range.max,
    );

    if (!bmiRange) {
      throw new Error('BMI range not found');
    }
    return bmiRange.status;
  }

  public paginate(paginateDto: CheckupMotherSearchDto) {
    const whereCondition: Prisma.CheckupMotherWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          mother: {
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
        {
          admin: {
            name: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (paginateDto.bmiStatus) {
      whereCondition.bmiStatus = paginateDto.bmiStatus;
    }

    if (paginateDto.month) {
      const monthStart = DateTime.fromISO(`${paginateDto.month}-01`)
        .startOf('month')
        .toJSDate();
      const monthEnd = DateTime.fromISO(`${paginateDto.month}-01`)
        .endOf('month')
        .toJSDate();

      whereCondition.createdAt = {
        gte: monthStart,
        lte: monthEnd,
      };
    }

    if (paginateDto.createdAt) {
      const inputDate = DateTime.fromISO(paginateDto.createdAt);
      const dayStart = inputDate.startOf('day').toJSDate();
      const dayEnd = inputDate.endOf('day').toJSDate();

      whereCondition.createdAt = {
        gte: dayStart,
        lte: dayEnd,
      };
    }

    return this.checkupMotherRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        healthPost: true,
        admin: true,
        fileDiagnosed: true,
        mother: true,
      },
    });
  }

  public detail(id: string) {
    try {
      return this.checkupMotherRepository.firstOrThrow(
        {
          id,
          deletedAt: null,
        },
        {
          admin: true,
          healthPost: true,
          fileDiagnosed: true,
          mother: true,
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.checkupMotherRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createCheckupMothersAdminDto: CreateCheckupMothersAdminDto,
    admin: Admin,
  ) {
    const bmi = this.calculateBmi(
      createCheckupMothersAdminDto.height,
      createCheckupMothersAdminDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi);

    const data: Prisma.CheckupMotherCreateInput = {
      month: createCheckupMothersAdminDto.month,
      height: createCheckupMothersAdminDto.height,
      weight: createCheckupMothersAdminDto.weight,
      upperArmCircumference: createCheckupMothersAdminDto.upperArmCircumference,
      fundusMeasurement: createCheckupMothersAdminDto.fundusMeasurement,
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
      type: OwnerType.ADMIN,
      mother: {
        connect: {
          id: createCheckupMothersAdminDto.motherId,
        },
      },
      admin: {
        connect: {
          id: admin.id,
        },
      },
      healthPost: {
        connect: {
          id: admin.healthPostId ?? '',
        },
      },
    };

    // if (createCheckupMothersAdminDto.fileDiagnosed) {
    //   const fileDiagnosed = await this.filesService.upload({
    //     file: createCheckupMothersAdminDto.fileDiagnosed,
    //     fileName: createCheckupMothersAdminDto.name ?? '',
    //   });

    //   data.status = CheckupStatus.VERIFIED;
    //   Object.assign(data, {
    //     fileDiagnosed: {
    //       connect: {
    //         id: fileDiagnosed.id,
    //       },
    //     },
    //   });
    // }
    return await this.checkupMotherRepository.create(data);
  }

  public async update(
    id: string,
    updateCheckupMothersAdminDto: UpdateCheckupMotherDto,
    admin: Admin,
  ) {
    try {
      let bmi: number | undefined;
      let bmiStatus: BMIStatus | undefined;
      if (
        updateCheckupMothersAdminDto.height &&
        updateCheckupMothersAdminDto.weight
      ) {
        bmi = this.calculateBmi(
          updateCheckupMothersAdminDto.height as number,
          updateCheckupMothersAdminDto.weight as number,
        );
        bmiStatus = this.getBMIStatus(bmi);
      }

      const data: Prisma.CheckupMotherUpdateInput = {
        month: updateCheckupMothersAdminDto.month,
        height: updateCheckupMothersAdminDto.height,
        weight: updateCheckupMothersAdminDto.weight,
        upperArmCircumference:
          updateCheckupMothersAdminDto.upperArmCircumference,
        fundusMeasurement: updateCheckupMothersAdminDto.fundusMeasurement,
        bmi,
        bmiStatus,
        status: CheckupStatus.UNVERIFIED,
        type: OwnerType.ADMIN,
        admin: {
          connect: {
            id: admin.id,
          },
        },
        healthPost: {
          connect: {
            id: admin.healthPostId ?? '',
          },
        },
      };

      // if (updateCheckupMothersAdminDto.fileDiagnosed) {
      //   const fileDiagnosed = await this.filesService.upload({
      //     file: updateCheckupMothersAdminDto.fileDiagnosed,
      //     fileName: updateCheckupMothersAdminDto.name ?? 'document',
      //   });
      //   Object.assign(data, {
      //     fileDiagnosed: {
      //       connect: {
      //         id: fileDiagnosed.id,
      //       },
      //     },
      //   });
      // }

      return await this.checkupMotherRepository.update({ id }, data);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async verifyCheckup(id: string, fileId: string) {
    try {
      // Update the status to VERIFIED and upload the file
      const updatedCheckup = await this.checkupMotherRepository.update(
        { id },
        { fileDiagnosed: { connect: { id: fileId } }, status: 'VERIFIED' },
      );

      return updatedCheckup;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async exportExcel(filterDto: CheckupMotherSearchDto): Promise<Buffer> {
    const whereCondition: Prisma.CheckupMotherWhereInput = {
      deletedAt: null,
    };

    // Filter search (jika ada)
    if (filterDto.search) {
      whereCondition.OR = [
        {
          mother: {
            name: {
              contains: filterDto.search,
              mode: 'insensitive',
            },
          },
        },
        {
          healthPost: {
            name: {
              contains: filterDto.search,
              mode: 'insensitive',
            },
          },
        },
        {
          admin: {
            name: {
              contains: filterDto.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Filter by createdAt date
    if (filterDto.month) {
      const monthStart = DateTime.fromISO(`${filterDto.month}-01`)
        .startOf('month')
        .toJSDate();
      const monthEnd = DateTime.fromISO(`${filterDto.month}-01`)
        .endOf('month')
        .toJSDate();

      whereCondition.createdAt = {
        gte: monthStart,
        lte: monthEnd,
      };
    } else if (filterDto.createdAt) {
      const inputDate = DateTime.fromISO(filterDto.createdAt);
      const dayStart = inputDate.startOf('day').toJSDate();
      const dayEnd = inputDate.endOf('day').toJSDate();

      whereCondition.createdAt = {
        gte: dayStart,
        lte: dayEnd,
      };
    }

    const data = await this.checkupMotherRepository.findMany(whereCondition, {
      mother: true,
      healthPost: true,
      admin: true,
      fileDiagnosed: true,
    });

    let title = 'LAPORAN PEMERIKSAAN IBU';
    if (filterDto.month) {
      const monthText = DateTime.fromISO(`${filterDto.month}-01`)
        .setLocale('id')
        .toFormat('MMMM yyyy');
      title = `LAPORAN PEMERIKSAAN IBU BULAN ${monthText.toUpperCase()}`;
    } else if (filterDto.createdAt) {
      const dateText = DateTime.fromISO(filterDto.createdAt)
        .setLocale('id')
        .toFormat('dd MMMM yyyy');
      title = `LAPORAN PEMERIKSAAN IBU PADA ${dateText.toUpperCase()}`;
    }

    // Buat worksheet dan title
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Checkup Data');
    worksheet.columns = [
      { width: 6 }, // No
      { width: 18 }, // Tanggal
      { width: 26 }, // Nama Ibu
      { width: 20 }, // Berat Badan
      { width: 20 }, // Tinggi Badan
      { width: 22 }, // Lingkar Lengan Atas
      { width: 22 }, // Usia Kehamilan
      { width: 10 }, // BMI
      { width: 20 }, // Status
      { width: 26 }, // Nama Pemeriksa
      { width: 20 }, // Lokasi Pemeriksaan
    ];

    // Judul besar
    worksheet.mergeCells('A1:K1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 28;

    // Baris kosong
    worksheet.addRow([]);

    // Header (gunakan addRow langsung!)
    const headerRow = worksheet.addRow([
      'No',
      'Tanggal',
      'Nama Ibu',
      'Berat Badan (kg)',
      'Tinggi Badan (cm)',
      'Lingkar Lengan Atas (cm)',
      'Usia Kehamilan (Bulan)',
      'BMI',
      'Status',
      'Nama Pemeriksa',
      'Lokasi Pemeriksaan',
    ]);

    // Styling header
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Tambahkan data
    data.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        DateTime.fromISO(item.createdAt.toISOString()).toFormat('dd-MM-yy'),
        item.mother.name,
        item.weight,
        item.height,
        item.upperArmCircumference,
        item.month,
        item.bmi,
        translateBMI(item.bmiStatus),
        item.admin?.name || item.publicStaff,
        item.healthPost?.name || item.location,
      ]);
    });

    // Tambahkan border ke semua data cell
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= 1) return; // skip judul dan row kosong
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
