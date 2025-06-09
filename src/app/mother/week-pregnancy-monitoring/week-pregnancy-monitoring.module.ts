import { Module } from '@nestjs/common';
import { WeekPregnancyMonitoringHttpController } from './controllers';
import { WeekPregnancyMonitoringRepository } from './repositories';
import { WeekPregnancyMonitoringService } from './services';

@Module({
  controllers: [WeekPregnancyMonitoringHttpController],
  providers: [
    WeekPregnancyMonitoringService,
    WeekPregnancyMonitoringRepository,
  ],
})
export class WeekPregnancyMonitoringModule {}
