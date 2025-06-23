import { Injectable } from '@nestjs/common';
import { CheckupChildrenRepository, Filter } from '../repositories';
import { BMIStatus, Gender } from '@prisma/client';
import { BMI_RANGES } from 'src/common/constants/bmi.constant';
import { SearchCheckupChildrenDto } from '../dtos/search-checkup-children.dto';
import { DateTime } from 'luxon';
import { Buffer } from 'exceljs';
import * as ExcelJS from 'exceljs';
import { ChildrenRepository } from '../../children/repositories';

@Injectable()
export class CheckupChildrenService {
  constructor(
    private readonly checkupChildrenRepository: CheckupChildrenRepository,
    private readonly childrenRepository: ChildrenRepository,
  ) {}

  public calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public getBMIStatus(bmi: number, gender: Gender, age: number): BMIStatus {
    console.log(bmi, gender, age);
    // Get the age group ranges for the given gender
    const ageGroups = BMI_RANGES[gender || 'MALE'];

    // Find the appropriate age group
    const ageGroup = ageGroups.find(
      (group) => age >= group.min && age < group.max,
    );
    if (!ageGroup) {
      throw new Error('Age group not found');
    }

    // Find the BMI range that matches the calculated BMI
    const bmiRange = ageGroup.ranges.find(
      (range) => bmi >= range.min && bmi <= range.max,
    );
    if (!bmiRange) {
      throw new Error('BMI range not found');
    }

    return bmiRange.status;
  }

  public async paginate(
    paginateDto: SearchCheckupChildrenDto,
    childrenId: string,
  ) {
    const filter: Filter = {
      where: {
        deletedAt: null,
        childrenId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: true,
        fileDiagnosed: true,
      },
    };

    return this.checkupChildrenRepository.paginate(paginateDto, filter);
  }

  public countChildren(userId: string) {
    return this.checkupChildrenRepository.count({
      where: {
        id: {},
        children: {
          userId: userId,
        },
        deletedAt: null,
      },
    });
  }

  public async detail(id: string) {
    const data = await this.checkupChildrenRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        fileDiagnosed: true,
        children: {
          include: {
            childPicture: true,
          },
        },
      },
    );

    const birth = DateTime.fromISO(data.children.dateOfBirth.toISOString());
    const now = DateTime.now();
    const age = now.diff(birth, 'years').years;
    const ageRounded = Math.floor(age);

    const children = {
      ...data.children,
      age: ageRounded,
    };

    data.children = children;

    return data;
  }

  async exportExcel(childrenId: string): Promise<Buffer> {
    const data = await this.checkupChildrenRepository.findMany(
      {
        childrenId,
        deletedAt: null,
      },
      {
        children: true,
      },
    );

    const children = await this.childrenRepository.findFirst({
      id: childrenId,
      deletedAt: null,
    });
    if (!children) {
      throw new Error('Child not found');
    }

    const childName = children.name;
    const firstTwo = childName.split(' ').slice(0, 2).join(' ').toUpperCase();

    // Buat worksheet dan title
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Checkup Data');
    worksheet.columns = [
      { width: 6 }, // No
      { width: 18 }, // Tanggal
      { width: 20 }, // Berat Badan
      { width: 20 }, // Tinggi Badan
      { width: 22 }, // Lingkar Kepala
    ];

    // Judul besar
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `LAPORAN PEMERIKSAAN ANAK DENGAN NAMA ${firstTwo.toUpperCase()}`;
    titleCell.font = { size: 1, bold: true };
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
      'Lingkar Kepala (cm)',
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
        item.headCircumference,
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
