import { Module } from '@nestjs/common';
import { MonthBloodHttpController } from './controllers';
import { MonthBloodService } from './services';
import { MonthBloodRepository } from './repositories';

@Module({
  controllers: [MonthBloodHttpController],
  providers: [MonthBloodService, MonthBloodRepository],
})
export class MonthBloodModule {}
