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
import { BloodRecordPublicService } from './services/blood-record-public.service';

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
    BloodRecordPublicService,
    BloodRecordRepository,
  ],
})
export class BloodRecordModule {}
