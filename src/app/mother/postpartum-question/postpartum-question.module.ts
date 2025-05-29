import { Module } from '@nestjs/common';
import { PostpartumQuestionHttpController } from './controllers';
import { PostpartumQuestionService } from './services';
import { PostpartumQuestionRepository } from './repositories';

@Module({
  controllers: [PostpartumQuestionHttpController],
  providers: [PostpartumQuestionService, PostpartumQuestionRepository],
})
export class PostpartumQuestionModule {}
