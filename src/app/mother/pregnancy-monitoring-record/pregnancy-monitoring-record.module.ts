import { Module } from '@nestjs/common';
import {
  PregnancyMonitoringRecordAdminHttpController,
  PregnancyMonitoringRecordHttpController,
} from './controllers';
import { PregnancyMonitoringRecordService } from './services';
import { PregnancyMonitoringRecordRepository } from './repositories';
import { MotherModule } from '../mother';
import { PregnancyMonitoringRecordAdminService } from './services/pregnancy-monitoring-record-admin.service';

@Module({
  imports: [MotherModule],
  controllers: [
    PregnancyMonitoringRecordHttpController,
    PregnancyMonitoringRecordAdminHttpController,
  ],
  providers: [
    PregnancyMonitoringRecordService,
    PregnancyMonitoringRecordAdminService,
    PregnancyMonitoringRecordRepository,
  ],
})
export class PregnancyMonitoringRecordModule {}
