import { Module } from '@nestjs/common';
import { ArticleHttpController } from './controllers';
import { ArticleService } from './services';
import { ArticleRepository } from './repositories';
// import { FileService } from '../file/services';

@Module({
  // imports: [FileService],
  controllers: [ArticleHttpController],
  providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
