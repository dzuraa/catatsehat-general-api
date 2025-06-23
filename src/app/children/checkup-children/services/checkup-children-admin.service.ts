import { Injectable } from '@nestjs/common';
import {
  Prisma,
  BMIStatus,
  CheckupStatus,
  Gender,
  Admin,
} from '@prisma/client';
import { BMI_RANGES } from 'src/common/constants/bmi.constant';
import { DateTime } from 'luxon';
import { ChildrenRepository } from '../../children/repositories';
import { CheckupChildrenRepository, Filter } from '../repositories';
import { FileService } from '@/app/file/services';
import { SearchCheckupChildrenDto } from '../dtos/search-checkup-children.dto';
import { HealthPostRepository } from '@/app/healthpost/repositories';
import { AdminRepository } from '@/app/admin/repositories';
import { CreateCheckupChildrenDto, UpdateCheckupChildrenDto } from '../dtos';
import { Buffer } from 'exceljs';
import ExcelJS from 'exceljs';
import { translateBMI } from '@/common/helpers/bmi-status.helper';

@Injectable()
export class CheckupChildrenAdminService {
  constructor(
    private readonly checkupChildrenRepository: CheckupChildrenRepository,
    private readonly filesService: FileService,
    private readonly childrenRepository: ChildrenRepository,
    private readonly healthPostRepository: HealthPostRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  private calculateBmi(height: number, weight: number): number {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  private getBMIStatus(bmi: number, gender: Gender, age: number): BMIStatus {
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

  public async paginate(paginateDto: SearchCheckupChildrenDto) {
    const whereCondition: Prisma.CheckupChildrenWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          children: {
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

    const filter: Filter = {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: true,
        healthPost: true,
        admin: true,
        fileDiagnosed: true,
      },
    };

    return this.checkupChildrenRepository.paginate(paginateDto, filter);
  }

  public async detail(id: string) {
    const data = await this.checkupChildrenRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        healthPost: true,
        fileDiagnosed: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            type: true,
          },
        },
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

  public async destroy(id: string) {
    try {
      return this.checkupChildrenRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createCheckupChildrenDto: CreateCheckupChildrenDto,
    admin: Admin,
  ) {
    const children = await this.childrenRepository.firstOrThrow({
      id: createCheckupChildrenDto.childrenId,
    });

    const diffMonth = Math.abs(
      DateTime.fromJSDate(children?.dateOfBirth as Date).diffNow('months')
        .months || 0,
    );
    const age = Number((diffMonth / 12).toFixed(1));

    if (age < 0 || age > 6) {
      throw new Error('err.bmi_age');
    }

    const bmi = this.calculateBmi(
      createCheckupChildrenDto.height,
      createCheckupChildrenDto.weight,
    );

    if (!admin.healthPostId) {
      throw new Error('Admin does not have a valid HealthPost ID');
    }

    const bmiStatus = this.getBMIStatus(bmi, children.gender as Gender, age);

    const data: Prisma.CheckupChildrenCreateInput = {
      height: createCheckupChildrenDto.height,
      weight: createCheckupChildrenDto.weight,
      headCircumference: createCheckupChildrenDto.headCircumference,
      gender: children.gender,
      bmi,
      bmiStatus,
      status: CheckupStatus.UNVERIFIED,
      admin: {
        connect: {
          id: admin.id,
        },
      },
      children: {
        connect: {
          id: createCheckupChildrenDto.childrenId,
        },
      },
      healthPost: {
        connect: {
          id: admin.healthPostId,
        },
      },
    };

    if (
      createCheckupChildrenDto.fileDiagnosed &&
      createCheckupChildrenDto.fileDiagnosed !== 'string' &&
      createCheckupChildrenDto.fileDiagnosed.length > 0
    ) {
      const fileDiagnosed = await this.filesService.upload({
        file: createCheckupChildrenDto.fileDiagnosed,
        fileName: children.name ?? 'document',
      });

      data.status = CheckupStatus.VERIFIED;
      data.fileDiagnosed = {
        connect: {
          id: fileDiagnosed.id,
        },
      };
    }

    const createdCheckupChildren =
      await this.checkupChildrenRepository.create(data);

    const updatedChildrenData = await this.childrenRepository.update(
      {
        id: createCheckupChildrenDto.childrenId,
      },
      {
        height: createCheckupChildrenDto.height,
        weight: createCheckupChildrenDto.weight,
      },
    );

    return {
      createdCheckupChildren,
      updatedChildrenData,
    };
  }

  public async update(
    id: string,
    admin: Admin,
    updateCheckupChildrenDto: UpdateCheckupChildrenDto,
  ) {
    const checkupChild = await this.checkupChildrenRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        healthPost: true,
        children: true,
      },
    );

    const children = await this.childrenRepository.firstOrThrow({
      id: checkupChild.childrenId,
    });

    const diffMonth = Math.abs(
      DateTime.fromJSDate(children?.dateOfBirth as Date).diffNow('months')
        .months || 0,
    );
    const age = Number((diffMonth / 12).toFixed(1));

    let bmi: number | undefined;
    let bmiStatus: BMIStatus | undefined;

    if (updateCheckupChildrenDto.height && updateCheckupChildrenDto.weight) {
      if (age < 0 || age > 6) {
        throw new Error('err.bmi_age');
      }

      bmi = this.calculateBmi(
        updateCheckupChildrenDto.height,
        updateCheckupChildrenDto.weight,
      );
      bmiStatus = this.getBMIStatus(bmi, children?.gender, age);
    }

    const data: Prisma.CheckupChildrenUpdateInput = {
      height: updateCheckupChildrenDto.height,
      weight: updateCheckupChildrenDto.weight,
      headCircumference: updateCheckupChildrenDto.headCircumference,
      gender: children.gender,
      bmi,
      bmiStatus,
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

    if (updateCheckupChildrenDto.fileDiagnosed) {
      const fileDiagnosed = await this.filesService.upload({
        file: updateCheckupChildrenDto.fileDiagnosed,
        fileName: children.name ?? 'document',
      });

      data.status = CheckupStatus.VERIFIED;
      data.fileDiagnosed = {
        connect: {
          id: fileDiagnosed.id,
        },
      };
    }

    const updatedCheckupChildren = await this.checkupChildrenRepository.update(
      { id },
      data,
    );

    const updatedChildrenData = await this.childrenRepository.update(
      {
        id: checkupChild.childrenId,
      },
      {
        height: updateCheckupChildrenDto.height,
        weight: updateCheckupChildrenDto.weight,
      },
    );

    return {
      updatedCheckupChildren,
      updatedChildrenData,
    };
  }

  async exportExcel(filterDto: SearchCheckupChildrenDto): Promise<Buffer> {
    const whereCondition: Prisma.CheckupChildrenWhereInput = {
      deletedAt: null,
    };

    // Filter search (jika ada)
    if (filterDto.search) {
      whereCondition.OR = [
        {
          children: {
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

    const data = await this.checkupChildrenRepository.findMany(whereCondition, {
      children: true,
      healthPost: true,
      admin: true,
      fileDiagnosed: true,
    });

    let title = 'LAPORAN PEMERIKSAAN ANAK';
    if (filterDto.month) {
      const monthText = DateTime.fromISO(`${filterDto.month}-01`)
        .setLocale('id')
        .toFormat('MMMM yyyy');
      title = `LAPORAN PEMERIKSAAN ANAK BULAN ${monthText.toUpperCase()}`;
    } else if (filterDto.createdAt) {
      const dateText = DateTime.fromISO(filterDto.createdAt)
        .setLocale('id')
        .toFormat('dd MMMM yyyy');
      title = `LAPORAN PEMERIKSAAN ANAK PADA ${dateText.toUpperCase()}`;
    }

    // Buat worksheet dan title
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Checkup Data');
    worksheet.columns = [
      { width: 6 }, // No
      { width: 18 }, // Tanggal
      { width: 26 }, // Nama Anak
      { width: 20 }, // Jenis Kelamin
      { width: 20 }, // Berat Badan
      { width: 20 }, // Tinggi Badan
      { width: 22 }, // Lingkar Kepala
      { width: 20 }, // Angka BMI
      { width: 20 }, // Status BMI
      { width: 26 }, // Pemeriksa
      { width: 26 }, // Instansi Kesehatan
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
      'Nama Anak',
      'Jenis Kelamin',
      'Berat Badan (kg)',
      'Tinggi Badan (cm)',
      'Lingkar Kepala (cm)',
      'Angka BMI',
      'Status',
      'Pemeriksa',
      'Instansi Kesehatan',
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
        item.children.name,
        item.children.gender,
        item.weight,
        item.height,
        item.headCircumference,
        item.bmi,
        translateBMI(item.bmiStatus),
        item.admin.name,
        item.healthPost.name,
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
