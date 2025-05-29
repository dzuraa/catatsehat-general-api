import { Module } from '@nestjs/common';
import { PostpartumRecordHttpController } from './controllers';
import { PostpartumRecordRepository } from './repositories';
import { PostpartumRecordService } from './services';

@Module({
  controllers: [PostpartumRecordHttpController],
  providers: [PostpartumRecordService, PostpartumRecordRepository],
  exports: [PostpartumRecordRepository],
})
export class PostpartumRecordModule {}
