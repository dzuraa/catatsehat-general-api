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

@Injectable()
export class ImmunizationRecordService {
  constructor(
    private readonly immunizationrecordRepository: ImmunizationRecordRepository,
    private readonly childVaccineRepository: ChildVaccineRepository,
    private readonly childVaccineStageRepository: ChildVaccineStageRepository,
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
    const childVaccines = await this.childVaccineRepository.findMany({
      where: {
        childrenId,
      },
      include: {
        childVaccineStage: {
          orderBy: { order: 'asc' },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vaksinasi Anak');

    // Set column width
    worksheet.columns = [
      { width: 30 }, // Nama Vaksin
      { width: 30 }, // Nama Tahap
      { width: 18 }, // Usia Disarankan
      { width: 20 }, // Tanggal Pemberian
      { width: 25 }, // Status
      { width: 25 }, // Catatan
    ];

    // Title
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'LAPORAN STATUS VAKSINASI ANAK';
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 28;

    worksheet.addRow([]); // baris kosong

    for (const vaccine of childVaccines) {
      // Nama Vaksin Header
      const headerRow = worksheet.addRow([vaccine.name]);
      worksheet.mergeCells(`A${headerRow.number}:F${headerRow.number}`);
      headerRow.font = { bold: true, size: 12 };
      headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getRow(headerRow.number).height = 22;

      // Sub-header tahap vaksin
      const subHeader = worksheet.addRow([
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

      // Data tahap vaksin
      for (const stage of vaccine.childVaccineStage) {
        const row = worksheet.addRow([
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

      worksheet.addRow([]); // spacing antar vaksin
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
