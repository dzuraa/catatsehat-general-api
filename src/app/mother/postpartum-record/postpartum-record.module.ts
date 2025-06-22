import { Module } from '@nestjs/common';
import {
  PostpartumRecordAdminHttpController,
  PostpartumRecordHttpController,
} from './controllers';
import { PostpartumRecordService } from './services';
import { PostpartumRecordRepository } from './repositories';
import { MotherModule } from '../mother';

@Module({
  imports: [MotherModule],
  controllers: [
    PostpartumRecordHttpController,
    PostpartumRecordAdminHttpController,
  ],
  providers: [PostpartumRecordService, PostpartumRecordRepository],
})
export class PostpartumRecordModule {}
