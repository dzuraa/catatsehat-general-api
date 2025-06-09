import { Module } from '@nestjs/common';
import { PregnancyMonitoringRecordHttpController } from './controllers';
import { PregnancyMonitoringRecordRepository } from './repositories';
import { PregnancyMonitoringRecordService } from './services';

@Module({
  controllers: [PregnancyMonitoringRecordHttpController],
  providers: [
    PregnancyMonitoringRecordService,
    PregnancyMonitoringRecordRepository,
  ],
  exports: [PregnancyMonitoringRecordRepository],
})
export class PregnancyMonitoringRecordModule {}
