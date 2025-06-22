import { Module } from '@nestjs/common';
import {
  PregnancyMonitoringRecordAdminHttpController,
  PregnancyMonitoringRecordHttpController,
} from './controllers';
import { PregnancyMonitoringRecordService } from './services';
import { PregnancyMonitoringRecordRepository } from './repositories';
import { MotherModule } from '../mother';

@Module({
  imports: [MotherModule],
  controllers: [
    PregnancyMonitoringRecordHttpController,
    PregnancyMonitoringRecordAdminHttpController,
  ],
  providers: [
    PregnancyMonitoringRecordService,
    PregnancyMonitoringRecordRepository,
  ],
})
export class PregnancyMonitoringRecordModule {}
