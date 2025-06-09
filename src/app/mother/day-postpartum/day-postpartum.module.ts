import { Module } from '@nestjs/common';
import { DayPostpartumHttpController } from './controllers';
import { DayPostpartumRepository } from './repositories';
import { DayPostPartumService } from './services';

@Module({
  controllers: [DayPostpartumHttpController],
  providers: [DayPostPartumService, DayPostpartumRepository],
})
export class DayPostpartumModule {}
