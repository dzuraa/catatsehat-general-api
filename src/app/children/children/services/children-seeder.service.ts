import { Injectable } from '@nestjs/common';
import { VaccineRepository } from '../../vaccine/repositories';
import { ChildVaccineRepository } from '../../child-vaccine/repositories';
import { ChildVaccineStageRepository } from '../../child-vaccine-stage/repositories';

@Injectable()
export class ChildrenSeederService {
  constructor(
    private readonly vaccineRepository: VaccineRepository,
    private readonly childVaccineRepository: ChildVaccineRepository,
    private readonly childVaccineStageRepository: ChildVaccineStageRepository,
  ) {}

  public async seedChildImmunizations(childrenId: string) {
    // Get all vaccines with their stages
    const vaccines = await this.vaccineRepository.find({
      include: {
        vaccineStage: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Create records for each vaccine and its stages
    for (const vaccine of vaccines) {
      // Create ChildVaccine record
      const childVaccine = await this.childVaccineRepository.create({
        children: { connect: { id: childrenId } },
        vaccine: { connect: { id: vaccine.id } },
        name: vaccine.name,
        lastVaccineGiven: null,
        upcomingVaccine: vaccine.vaccineStage[0]?.name || null,
        immunizationStatus: 0,
      });

      // Create ChildVaccineStage records for each stage
      const stagePromises = vaccine.vaccineStage.map((stage, index) => {
        return this.childVaccineStageRepository.create({
          children: { connect: { id: childrenId } },
          vaccineStage: { connect: { id: stage.id } },
          childVaccine: { connect: { id: childVaccine.id } },
          name: stage.name,
          suggestedAge: stage.suggestedAge || '',
          order: index + 1,
          dateGiven: null,
          vaccineStatus: null,
          note: null,
        });
      });

      await Promise.all(stagePromises);
    }

    return {
      message: 'Child immunizations seeded successfully',
    };
  }
}
