import { Module } from '@nestjs/common';
import { ChildVaccineRepository } from './repositories';

@Module({
  providers: [ChildVaccineRepository],
  exports: [ChildVaccineRepository],
})
export class ChildVaccineModule {}
