import { Module } from '@nestjs/common';
import { VaccineHttpController } from './controllers';
import { VaccineService } from './services';
import { VaccineRepository } from './repositories';

@Module({
  controllers: [VaccineHttpController],
  providers: [VaccineService, VaccineRepository],
  exports: [VaccineService, VaccineRepository],
})
export class VaccineModule {}
