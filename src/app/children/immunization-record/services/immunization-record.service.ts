import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { ImmunizationRecordRepository } from '../repositories';
import { ChildVaccineRepository } from '../../child-vaccine/repositories';
import { ChildVaccineStageRepository } from '../../child-vaccine-stage/repositories';
import { translateStatus } from '@/common/helpers/vaccine-status.helper';
import { formatMonthAge } from '@/common/helpers/month-age.helper';
import { Buffer } from 'exceljs';
import * as ExcelJS from 'exceljs';
import { ChildrenRepository } from '../../children/repositories';
import { ImmunizationOptionalRecordRepository } from '../../immunization-optional-record/repositories';
import { DateTime } from 'luxon';

@Injectable()
export class ImmunizationRecordService {
  constructor(
    private readonly immunizationrecordRepository: ImmunizationRecordRepository,
    private readonly childVaccineRepository: ChildVaccineRepository,
    private readonly childVaccineStageRepository: ChildVaccineStageRepository,
    private readonly childrenRepository: ChildrenRepository,
    private readonly immunizationOptionalRecordRepository: ImmunizationOptionalRecordRepository,
  ) {}

  public async paginate(paginateDto: PaginationQueryDto, childrenId?: string) {
    const result = await this.immunizationrecordRepository.paginate(
      paginateDto,
      {
        where: {
          childrenId,
          deletedAt: null,
        },
        include: {
          children: {
            include: {
              mother: true,
            },
          },
          vaccine: true,
          vaccineStage: true,
        },
      },
    );

    return new PaginatedEntity(result.data, result.meta);
  }

  //   // Lakukan mapping hasil
  //   const mappedData = result.data.map((record) =>
  //     this.mapImmunizationRecord(record),
  //   );

  //   return new PaginatedEntity(mappedData, result.meta);
  // }

  // private mapImmunizationRecord(record: CreateImmunizationsArrayDto) {
  //   return {
  //     id: record.vaccine?.id || '',
  //     name: record.vaccine?.name || '',
  //     lastVaccineGiven: record.lastVaccineGiven || '',
  //     upcomingVaccine: record.upcomingVaccine || '',
  //     immunizationStatus: record.immunizationStatus || '',
  //     list: record.vaccineStage
  //       ? [
  //           {
  //             name: record.vaccineStage.name || '',
  //             suggestedAge: record.vaccineStage.suggestedAge || '',
  //             dateGiven: record.dateGiven || '',
  //             statusGiven: record.statusGiven || '',
  //             note: record.note || '',
  //           },
  //         ]
  //       : [],
  //   };
  // }

  public detail(id: string) {
    try {
      return this.immunizationrecordRepository.firstOrThrow({
        id,
        deletedAt: null,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getChildVaccines(childrenId: string) {
    try {
      const vaccines = await this.childVaccineRepository.find({
        where: { childrenId },
        select: {
          id: true,
          vaccineId: true,
          name: true,
          lastVaccineGiven: true,
          upcomingVaccine: true,
          immunizationStatus: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Transform immunization status for UI
      return vaccines;
    } catch (error) {
      throw new Error(`Failed to fetch child vaccines: ${error.message}`);
    }
  }

  public async getVaccineStagesDetail(childrenId: string, vaccineId: string) {
    try {
      const stages = await this.childVaccineStageRepository.find({
        where: {
          childrenId,
          childVaccine: { vaccineId },
        },
        select: {
          id: true,
          name: true,
          suggestedAge: true,
          dateGiven: true,
          vaccineStatus: true,
          note: true,
          order: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      // Transform the data to match UI requirements
      return stages;
    } catch (error) {
      throw new Error(`Failed to fetch vaccine stages: ${error.message}`);
    }
  }

  async exportExcel(childrenId: string): Promise<Buffer> {
    const [childVaccines, child, optionalVaccines] = await Promise.all([
      this.childVaccineRepository.findMany({
        where: { childrenId },
        include: {
          childVaccineStage: {
            orderBy: { order: 'asc' },
          },
        },
      }),
      this.childrenRepository.firstOrThrow({
        id: childrenId,
      }),
      this.immunizationOptionalRecordRepository.find({
        where: { childrenId },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const workbook = new ExcelJS.Workbook();

    // --- SHEET 1: Imunisasi Wajib ---
    const sheetWajib = workbook.addWorksheet('Imunisasi Wajib');
    sheetWajib.columns = [
      { width: 30 },
      { width: 30 },
      { width: 18 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
    ];

    // Title
    sheetWajib.mergeCells('A1:E1');
    const title1 = sheetWajib.getCell('A1');
    title1.value = `Laporan Imunisasi Wajib Anak ${child.name}`;
    title1.font = { size: 14, bold: true };
    title1.alignment = { vertical: 'middle', horizontal: 'center' };
    sheetWajib.getRow(1).height = 28;
    sheetWajib.addRow([]);

    for (const vaccine of childVaccines) {
      const headerRow = sheetWajib.addRow([vaccine.name]);
      sheetWajib.mergeCells(`A${headerRow.number}:E${headerRow.number}`);
      headerRow.font = { bold: true, size: 12 };
      headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
      sheetWajib.getRow(headerRow.number).height = 22;

      const subHeader = sheetWajib.addRow([
        'Nama Tahap',
        'Usia Disarankan',
        'Umur Pemberian',
        'Status',
        'Catatan',
      ]);

      subHeader.eachCell((cell) => {
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

      for (const stage of vaccine.childVaccineStage) {
        const row = sheetWajib.addRow([
          stage.name,
          stage.suggestedAge,
          formatMonthAge(stage.dateGiven),
          translateStatus(stage.vaccineStatus),
          stage.note || '-',
        ]);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }

      sheetWajib.addRow([]);
    }

    // --- SHEET 2: Imunisasi Tambahan ---
    const sheetTambahan = workbook.addWorksheet('Imunisasi Tambahan');
    sheetTambahan.columns = [
      { width: 10 }, // No
      { width: 20 }, // Tanggal Diberikan
      { width: 30 }, // Nama Vaksin
      { width: 20 }, // Umur Diberikan
      { width: 40 }, // Catatan
    ];

    sheetTambahan.mergeCells('A1:E1');
    const title2 = sheetTambahan.getCell('A1');
    title2.value = `Laporan Imunisasi Tambahan Anak ${child.name}`;
    title2.font = { size: 14, bold: true };
    title2.alignment = { vertical: 'middle', horizontal: 'center' };
    sheetTambahan.getRow(1).height = 28;
    sheetTambahan.addRow([]);

    const optionalHeader = sheetTambahan.addRow([
      'No',
      'Tanggal Diberikan',
      'Nama Vaksin',
      'Umur Diberikan',
      'Catatan',
    ]);

    optionalHeader.eachCell((cell) => {
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

    for (const [index, record] of optionalVaccines.entries()) {
      const row = sheetTambahan.addRow([
        index + 1,
        DateTime.fromJSDate(record.createdAt)
          .setLocale('id')
          .toFormat('dd MMMM yyyy'),
        record.name,
        `${record.dateGiven} bulan`,
        record.note || '-',
      ]);

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Center-kan isi kolom "No"
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
