import { Module } from '@nestjs/common';
import { ChildVaccineStageRepository } from './repositories';

@Module({
  providers: [ChildVaccineStageRepository],
  exports: [ChildVaccineStageRepository],
})
export class ChildVaccineStageModule {}
