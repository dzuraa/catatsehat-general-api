import { Module } from '@nestjs/common';
import { PostpartumRecordModule } from '../postpartum-record';
import { PostPartumHttpController } from './controllers';
import { PostPartumRepository } from './repositories';
import { PostPartumService } from './services';

@Module({
  imports: [PostpartumRecordModule],
  controllers: [PostPartumHttpController],
  providers: [PostPartumService, PostPartumRepository],
})
export class PostPartumModule {}
