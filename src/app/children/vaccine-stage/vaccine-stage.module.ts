import { Module } from '@nestjs/common';
import { VaccineStageHttpController } from './controllers';
import { VaccineStageService } from './services';
import { VaccineStageRepository } from './repositories';

@Module({
  controllers: [VaccineStageHttpController],
  providers: [VaccineStageService, VaccineStageRepository],
  exports: [VaccineStageService, VaccineStageRepository],
})
export class VaccineStageModule {}
