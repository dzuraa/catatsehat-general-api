import { Module } from '@nestjs/common';
import {
  BloodRecordAdminHttpController,
  BloodRecordHttpController,
  BloodRecordPublicHttpController,
} from './controllers';
import { BloodRecordService } from './services';
import { BloodRecordRepository } from './repositories';
import { MotherModule } from '../mother';
import { BloodRecordAdminService } from './services/blood-record-admin.service';

@Module({
  imports: [MotherModule],
  controllers: [
    BloodRecordHttpController,
    BloodRecordAdminHttpController,
    BloodRecordPublicHttpController,
  ],
  providers: [
    BloodRecordService,
    BloodRecordAdminService,
    BloodRecordRepository,
  ],
})
export class BloodRecordModule {}
