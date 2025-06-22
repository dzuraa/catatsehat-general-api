import { Module } from '@nestjs/common';
import {
  BloodRecordAdminHttpController,
  BloodRecordHttpController,
} from './controllers';
import { BloodRecordService } from './services';
import { BloodRecordRepository } from './repositories';
import { MotherModule } from '../mother';

@Module({
  imports: [MotherModule],
  controllers: [BloodRecordHttpController, BloodRecordAdminHttpController],
  providers: [BloodRecordService, BloodRecordRepository],
})
export class BloodRecordModule {}
