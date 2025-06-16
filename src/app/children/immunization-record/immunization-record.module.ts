import { Module } from '@nestjs/common';
import {
  ImmunizationHttpController,
  ImmunizationRecordAdminHttpController,
} from './controllers';
import { ImmunizationRecordAdminService } from './services/immunization-record-admin.service';
import { ImmunizationRecordService } from './services';
import { ImmunizationRecordRepository } from './repositories';
import { ChildVaccineModule } from '../child-vaccine';
import { ChildVaccineStageModule } from '../child-vaccine-stage';
import { VaccineStageModule } from '../vaccine-stage';
import { VaccineModule } from '../vaccine';
import { ChildrenModule } from '../children';

@Module({
  imports: [
    ChildrenModule,
    VaccineModule,
    VaccineStageModule,
    ChildVaccineModule,
    ChildVaccineStageModule,
  ],
  controllers: [
    ImmunizationRecordAdminHttpController,
    ImmunizationHttpController,
  ],
  providers: [
    ImmunizationRecordAdminService,
    ImmunizationRecordService,
    ImmunizationRecordRepository,
  ],
})
export class ImmunizationRecordModule {}
