import { Module } from '@nestjs/common';
import {
  ImmunizationOptionalRecordAdminHttpController,
  ImmunizationOptionalRecordHttpController,
} from './controllers';
import { ImmunizationOptionalRecordService } from './services';
import { ImmunizationOptionalRecordRepository } from './repositories';
import { ImmunizationOptionalRecordAdminService } from './services/immunization-optional-record-admin.service';
import { ChildrenModule } from '../children';

@Module({
  imports: [ChildrenModule],
  controllers: [
    ImmunizationOptionalRecordHttpController,
    ImmunizationOptionalRecordAdminHttpController,
  ],
  providers: [
    ImmunizationOptionalRecordService,
    ImmunizationOptionalRecordAdminService,
    ImmunizationOptionalRecordRepository,
  ],
  exports: [
    ImmunizationOptionalRecordService,
    ImmunizationOptionalRecordAdminService,
    ImmunizationOptionalRecordRepository,
  ],
})
export class ImmunizationOptionalRecordModule {}
