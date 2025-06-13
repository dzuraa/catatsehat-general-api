import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
// import { vaccineAgeRules } from '../constants/status.constant';
import {
  ChildVaccineStage,
  ImmunizationRecord,
  Prisma,
  Vaccine,
} from '@prisma/client';
import { VaccineNameMapping } from '../helper/vaccination-mapping.helper';
import { VaccinationStatusHelper } from '../helper/immunization.helper';
import { ImmunizationRecordRepository } from '../repositories';
import { VaccineStageRepository } from '../../vaccine-stage/repositories';
import { ChildrenRepository } from '../../children/repositories';
import { ChildVaccineRepository } from '../../child-vaccine/repositories';
import { ChildVaccineStageRepository } from '../../child-vaccine-stage/repositories';
import {
  CreateImmunizationArrayDto,
  SearchImmunizationRecordDto,
  UpdateImmunizationRecordDto,
} from '../dtos';

@Injectable()
export class ImmunizationRecordAdminService {
  constructor(
    private readonly immunizationrecordRepository: ImmunizationRecordRepository,
    private readonly vaccineStageRepository: VaccineStageRepository,
    private readonly childRepository: ChildrenRepository,
    private readonly childVaccineRepository: ChildVaccineRepository,
    private readonly childVaccineStageRepository: ChildVaccineStageRepository,
  ) {}

  public paginate(paginateDto: SearchImmunizationRecordDto) {
    const whereCondition: Prisma.ImmunizationRecordWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          children: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
        {
          children: {
            mother: {
              name: {
                contains: paginateDto.search.trim(),
                mode: 'insensitive',
              },
            },
          },
        },
        {
          vaccineStage: {
            name: {
              contains: paginateDto.search.trim(),
              mode: 'insensitive',
            },
          },
        },
        {
          note: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }
    return this.immunizationrecordRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: {
          include: {
            mother: true,
          },
        },
        vaccineStage: true,
      },
    });
  }

  public async paginateByCode(paginateDto: PaginationQueryDto, code: string) {
    // Find child data by code
    const child = await this.childRepository.firstOrThrow({
      code,
    });

    // Paginate data by child id
    return this.immunizationrecordRepository.paginate(paginateDto, {
      where: {
        childrenId: child.id,
        deletedAt: null,
      },
      include: {
        children: {
          include: {
            mother: true,
          },
        },
        vaccineStage: {
          include: {
            vaccine: true,
          },
        },
      },
    });
  }

  public detail(id: string) {
    try {
      return this.immunizationrecordRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      // Fetch existing record with relationships
      const existingRecord =
        await this.immunizationrecordRepository.firstOrThrow(
          { id },
          {
            vaccine: true,
            vaccineStage: true,
            child: true,
          },
        );

      const childrenId = existingRecord.childrenId!;
      const vaccineId = existingRecord.vaccineId!;
      const vaccineStageId = existingRecord.vaccineStageId;

      // Soft delete immunization record
      const deletedRecord = await this.immunizationrecordRepository.delete({
        id,
      });

      // Reset ChildVaccineStage if vaccineStageId is present
      if (vaccineStageId) {
        await this.childVaccineStageRepository.update(
          {
            childrenId_vaccineStageId: { childrenId, vaccineStageId },
          },
          {
            dateGiven: null,
            note: null,
            vaccineStatus: null,
          },
        );
      }

      // Update ChildVaccine
      const vaccineStages = await this.childVaccineStageRepository.find({
        where: {
          childrenId,
          vaccineStage: {
            vaccineId,
          },
        },
      });

      if (vaccineStages.length) {
        // Find last completed stage (with non-null vaccineStatus)
        const completedStages = vaccineStages.filter(
          (stage) =>
            stage.vaccineStatus !== null && stage.vaccineStatus !== undefined,
        );

        const lastCompletedStage =
          completedStages.length > 0
            ? completedStages[completedStages.length - 1]
            : null;

        // Determine next stage
        const nextStage = lastCompletedStage
          ? await this.getNextVaccineStage(
              vaccineId,
              lastCompletedStage.vaccineStageId,
            )
          : null;

        // Update ChildVaccine
        await this.childVaccineRepository.update(
          {
            childrenId_vaccineId: { childrenId, vaccineId },
          },
          {
            lastVaccineGiven: lastCompletedStage?.name || null,
            upcomingVaccine: nextStage?.name || null,
            immunizationStatus:
              VaccinationStatusHelper.determineImmunizationStatus(
                vaccineStages,
              ),
          },
        );
      }

      return deletedRecord;
    } catch (error) {
      throw new Error(`Error deleting immunization record: ${error.message}`);
    }
  }

  public async bulkCreate(
    createImmunizationArrayDto: CreateImmunizationArrayDto,
  ) {
    try {
      const { childrenId, immunizations } = createImmunizationArrayDto;

      // Validate if immunization records already exist
      const existingStages = await this.childVaccineStageRepository.find({
        where: {
          childrenId,
          vaccineStageId: {
            in: immunizations.map((i) => i.vaccineStageId),
          },
          dateGiven: {
            not: null,
          },
        },
      });

      if (existingStages.length > 0) {
        const stageNames = existingStages.map((stage) => stage.name).join(', ');
        throw new Error(
          `Immunization records already exist for the following vaccine stages: ${stageNames}`,
        );
      }

      const vaccineStages = await this.vaccineStageRepository.findMany({
        where: {
          id: {
            in: immunizations.map((i) => i.vaccineStageId),
          },
        },
        include: {
          vaccine: true,
        },
      });

      const immunizationsByVaccine = vaccineStages.reduce((acc, stage) => {
        const vaccineId = stage.vaccineId!;
        if (!acc[vaccineId]) {
          acc[vaccineId] = {
            stages: [],
            vaccine: stage.vaccineId,
          };
        }
        acc[vaccineId].stages.push(stage);
        return acc;
      }, {});

      for (const [vaccineId, data] of Object.entries(immunizationsByVaccine)) {
        const vaccineStages = (
          data as { stages: ChildVaccineStage[]; vaccine: Vaccine }
        ).stages;
        const stageUpdates: Promise<ChildVaccineStage>[] = [];
        const immunizationRecords: Promise<ImmunizationRecord>[] = [];
        const stageStatuses = new Map<string, number | null>();

        for (const stage of vaccineStages) {
          const immunization = immunizations.find(
            (i) => i.vaccineStageId === stage.id,
          );
          if (immunization) {
            const mappedVaccineName = VaccineNameMapping[stage.name];
            if (!mappedVaccineName) {
              throw new Error(`No mapping found for vaccine: ${stage.name}`);
            }

            const vaccineStatus =
              VaccinationStatusHelper.calculateVaccineStatus(
                immunization.dateGiven,
                mappedVaccineName,
              );

            stageStatuses.set(stage.id, vaccineStatus);

            stageUpdates.push(
              this.childVaccineStageRepository.update(
                {
                  childrenId_vaccineStageId: {
                    childrenId,
                    vaccineStageId: stage.id,
                  },
                },
                {
                  dateGiven: immunization.dateGiven,
                  note: immunization.note,
                  vaccineStatus,
                },
              ),
            );

            immunizationRecords.push(
              this.immunizationrecordRepository.create({
                children: { connect: { id: childrenId } },
                vaccine: { connect: { id: vaccineId } },
                vaccineStage: { connect: { id: stage.id } },
                dateGiven: immunization.dateGiven,
                note: immunization.note,
                vaccineStatus,
              }),
            );
          }
        }

        const allStages = await this.childVaccineStageRepository.find({
          where: {
            childrenId,
            vaccineStage: {
              vaccineId,
            },
          },
          include: {
            vaccineStage: true,
          },
        });

        allStages.forEach((stage) => {
          stageStatuses.set(stage.vaccineStageId, stage.vaccineStatus ?? null);
        });

        const mergedStages = allStages.map((stage) => ({
          ...stage,
          vaccineStatus: stageStatuses.get(stage.vaccineStageId) ?? null,
          childrenId: stage.childrenId,
          vaccineStageId: stage.vaccineStageId,
          childVaccineId: stage.childVaccineId,
          dateGiven: stage.dateGiven,
          note: stage.note,
        }));

        const immunizationStatus =
          VaccinationStatusHelper.determineImmunizationStatus(mergedStages);

        const lastStage = vaccineStages[vaccineStages.length - 1];
        const nextStage = await this.getNextVaccineStage(
          vaccineId,
          lastStage.id,
        );

        await this.childVaccineRepository.update(
          {
            childrenId_vaccineId: {
              childrenId,
              vaccineId,
            },
          },
          {
            lastVaccineGiven: lastStage.name,
            upcomingVaccine: nextStage?.name || null,
            immunizationStatus,
          },
        );

        await this.childRepository.update(
          { id: childrenId },
          {
            code: null,
          },
        );

        await Promise.all([...stageUpdates, ...immunizationRecords]);
      }

      return {
        message: 'Immunization records created successfully',
      };
    } catch (error) {
      throw new Error(`Error updating immunization records: ${error.message}`);
    }
  }

  private async getNextVaccineStage(vaccineId: string, currentStageId: string) {
    // Dapatkan order dari stage saat ini
    const currentStage = await this.vaccineStageRepository.findFirst({
      where: {
        id: currentStageId,
      },
    });

    // Cari stage berikutnya
    return await this.vaccineStageRepository.findFirst({
      where: {
        vaccineId,
        id: {
          not: currentStageId,
        },
        order: {
          gt: currentStage?.order ?? 0,
        },
      },
    });
  }

  public async update(
    id: string,
    updateImmunizationsDto: UpdateImmunizationRecordDto,
  ) {
    try {
      const existingRecord =
        await this.immunizationrecordRepository.firstOrThrow(
          { id },
          {
            vaccine: true,
            vaccineStage: true,
            child: true,
          },
        );

      // Update ImmunizationRecord
      const updatedRecord = await this.immunizationrecordRepository.update(
        { id },
        updateImmunizationsDto,
      );

      // Update ChildVaccineStage
      if (existingRecord.vaccineStageId) {
        const originalVaccineName = existingRecord.vaccine!.name;
        const mappedVaccineName = VaccineNameMapping[originalVaccineName];

        if (!mappedVaccineName) {
          return updatedRecord;
        }

        const vaccineStatus = VaccinationStatusHelper.calculateVaccineStatus(
          updatedRecord.dateGiven!,
          mappedVaccineName,
        );

        await this.childVaccineStageRepository.update(
          {
            childrenId_vaccineStageId: {
              childrenId: existingRecord.childrenId!,
              vaccineStageId: existingRecord.vaccineStageId!,
            },
          },
          {
            dateGiven: updatedRecord.dateGiven,
            note: updatedRecord.note,
            vaccineStatus,
          },
        );
      }

      return updatedRecord;
    } catch (error) {
      throw new Error(`Error updating immunization record: ${error.message}`);
    }
  }
}
