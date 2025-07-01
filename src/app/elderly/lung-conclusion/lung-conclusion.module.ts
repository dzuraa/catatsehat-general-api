import { Module } from '@nestjs/common';
import { LungConclusionHttpController } from './controllers';
import { LungConclusionService } from './services';
import { LungConclusionRepository } from './repositories';

@Module({
  controllers: [LungConclusionHttpController],
  providers: [LungConclusionService, LungConclusionRepository],
})
export class LungConclusionModule {}
