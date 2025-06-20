import { Module } from '@nestjs/common';
import { ArticleHttpController } from './controllers';
import { ArticleService } from './services';
import { ArticleRepository } from './repositories';
import { ArticleAdminHttpController } from './controllers/http/article-admin.controller';
import { FileModule } from '../file'; 

@Module({
  imports: [FileModule],
  controllers: [ArticleHttpController, ArticleAdminHttpController],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
