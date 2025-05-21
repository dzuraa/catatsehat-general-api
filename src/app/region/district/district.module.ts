import { Module } from '@nestjs/common';
import { DistrictHttpController } from './controllers';
import { DistrictService } from './services';
import { DistrictRepository } from './repositories';

@Module({
  controllers: [DistrictHttpController],
  providers: [DistrictService, DistrictRepository],
})
export class DistrictModule {}
