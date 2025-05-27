import { Module } from '@nestjs/common';
import {
  ScheduleHttpController,
  ScheduleHttpControllerAdmin,
} from './controllers';
import { ScheduleService, ScheduleServiceAdmin } from './services';
import { ScheduleRepository } from './repositories';
import { AdminModule } from '../admin';
import { HealthPostModule } from '../healthpost';

@Module({
  imports: [AdminModule, HealthPostModule],
  controllers: [ScheduleHttpControllerAdmin, ScheduleHttpController],
  providers: [ScheduleService, ScheduleServiceAdmin, ScheduleRepository],
})
export class ScheduleModule {}
