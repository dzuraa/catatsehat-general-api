import { Module } from '@nestjs/common';
import { PregnancyMonitoringRecordModule } from '../pregnancy-monitoring-record';
import { PregnancyMonitoringHttpController } from './controllers';
import { PregnancyMonitoringRepository } from './repositories';
import { PregnancyMonitoringService } from './services';

@Module({
  imports: [PregnancyMonitoringRecordModule],
  controllers: [PregnancyMonitoringHttpController],
  providers: [PregnancyMonitoringService, PregnancyMonitoringRepository],
})
export class PregnancyMonitoringModule {}
