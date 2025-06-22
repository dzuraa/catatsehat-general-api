import { Module } from '@nestjs/common';
import {
  PostpartumRecordAdminHttpController,
  PostpartumRecordHttpController,
} from './controllers';
import { PostpartumRecordService } from './services';
import { PostpartumRecordRepository } from './repositories';
import { MotherModule } from '../mother';
import { PostpartumRecordAdminService } from './services/postpartum-record-admin.service';

@Module({
  imports: [MotherModule],
  controllers: [
    PostpartumRecordHttpController,
    PostpartumRecordAdminHttpController,
  ],
  providers: [
    PostpartumRecordService,
    PostpartumRecordAdminService,
    PostpartumRecordRepository,
  ],
})
export class PostpartumRecordModule {}
