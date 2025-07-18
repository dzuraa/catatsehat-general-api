import { Module } from '@nestjs/common';
import { BmiCategoryHttpController } from './controllers';
import { BmiCategoryService } from './services';
import { BmiCategoryRepository } from './repositories';

@Module({
  controllers: [BmiCategoryHttpController],
  providers: [BmiCategoryService, BmiCategoryRepository],
})
export class BmiCategoryModule {}
