import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { ImmunizationRecordRepository } from '../repositories';
import { ChildVaccineRepository } from '../../child-vaccine/repositories';
import { ChildVaccineStageRepository } from '../../child-vaccine-stage/repositories';

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
}
