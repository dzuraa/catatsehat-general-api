import { Injectable } from '@nestjs/common';
import {
  BMIStatus,
  CheckupStatus,
  OwnerType,
  Prisma,
  User,
} from '@prisma/client';
import { BMI_RANGES_MOTHER } from '@/common/constants/bmi.constant';
import { MotherRepository } from '../../mother/repositories';
import { CreateCheckupMothersPublicDto } from '../dtos';
import { CheckupMotherSearchDto } from '../dtos/search-checkup-mother.dto';
import { CheckupMotherRepository } from '../repositories';
import { Buffer } from 'exceljs';
import * as ExcelJS from 'exceljs';
import { DateTime } from 'luxon';
import { translateBMI } from '@/common/helpers/bmi-status.helper';
import { FileService } from '@/app/file/services';

@Injectable()
export class CheckupMothersPublicService {
  constructor(
    private readonly checkupMotherRepository: CheckupMotherRepository,
    private readonly filesService: FileService,
    private readonly motherRepository: MotherRepository,
  ) {}

  public async paginate(paginateDto: CheckupMotherSearchDto, user: User) {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });
    if (!mother) {
      throw new Error('Mother not found');
    }

    const whereCondition: Prisma.CheckupMotherWhereInput = {
      mother,
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
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

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

  public async create(
    createCheckupMothersAdminDto: CreateCheckupMothersPublicDto,
  ) {
    const mother = await this.motherRepository.firstOrThrow({
      id: createCheckupMothersAdminDto.motherId,
      deletedAt: null,
    });

    const bmi = this.calculateBmi(
      createCheckupMothersAdminDto.height,
      createCheckupMothersAdminDto.weight,
    );

    const bmiStatus = this.getBMIStatus(bmi);

    const data: Prisma.CheckupMotherCreateInput = {
      location: createCheckupMothersAdminDto.location,
      publicStaff: createCheckupMothersAdminDto.publicStaff,
      month: createCheckupMothersAdminDto.month,
      height: createCheckupMothersAdminDto.height,
      weight: createCheckupMothersAdminDto.weight,
      upperArmCircumference: createCheckupMothersAdminDto.upperArmCircumference,
      fundusMeasurement: createCheckupMothersAdminDto.fundusMeasurement,
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
      type: OwnerType.PUBLIC,
      mother: {
        connect: {
          id: mother.id,
        },
      },
    };

    if (createCheckupMothersAdminDto.motherId) {
      const parent = await this.motherRepository.first({
        id: createCheckupMothersAdminDto.motherId,
      });
      if (!parent) {
        throw new Error('Parent not found');
      }

      Object.assign(data, {
        mother: {
          connect: {
            id: createCheckupMothersAdminDto.motherId,
          },
        },
      });
    }

    if (createCheckupMothersAdminDto.fileDiagnosed) {
      const fileDiagnosed = await this.filesService.upload({
        file: createCheckupMothersAdminDto.fileDiagnosed,
        fileName: mother.name ?? '',
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
    return await this.checkupMotherRepository.create(data);
  }

  public countMothers(userId: string) {
    return this.checkupMotherRepository.count({
      where: {
        id: {},
        mother: {
          userId: userId,
        },
        deletedAt: null,
      },
    });
  }

  async exportExcel(user: User): Promise<Buffer> {
    const mother = await this.motherRepository.findFirst({
      userId: user.id,
      deletedAt: null,
    });
    if (!mother) {
      throw new Error('Mother not found');
    }

    const data = await this.checkupMotherRepository.findMany({
      mother,
      deletedAt: null,
    });

    const motherName = mother.name;
    const firstTwo = motherName.split(' ').slice(0, 2).join(' ').toUpperCase();

    // Buat worksheet dan title
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Checkup Data');
    worksheet.columns = [
      { width: 6 }, // No
      { width: 18 }, // Tanggal
      { width: 20 }, // Berat Badan
      { width: 20 }, // Tinggi Badan
      { width: 22 }, // Lingkar Lengan Atas
      { width: 22 }, // Usia Kehamilan
      { width: 10 }, // BMI
      { width: 20 }, // Status BMI
      { width: 20 }, // Lokasi Pemeriksaan
    ];

    // Judul besar
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `LAPORAN PEMERIKSAAN IBU DENGAN NAMA ${firstTwo.toUpperCase()}`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 28;

    // Baris kosong
    worksheet.addRow([]);

    // Header (gunakan addRow langsung!)
    const headerRow = worksheet.addRow([
      'No',
      'Tanggal',
      'Berat Badan (kg)',
      'Tinggi Badan (cm)',
      'Lingkar Lengan Atas (cm)',
      'Usia Kehamilan (Bulan)',
      'BMI',
      'Status BMI',
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
        item.weight,
        item.height,
        item.upperArmCircumference,
        item.month,
        item.bmi,
        translateBMI(item.bmiStatus),
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
