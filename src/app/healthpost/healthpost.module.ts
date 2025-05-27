import { Module } from '@nestjs/common';
import { HealthpostHttpController } from './controllers';
import { HealthPostService } from './services';
import { HealthPostRepository } from './repositories';
import { SubdistrictRepository } from '../region/subdistrict/repositories';

@Module({
  controllers: [HealthpostHttpController],
  providers: [HealthPostService, HealthPostRepository, SubdistrictRepository],
  exports: [HealthPostService, HealthPostRepository],
})
export class HealthPostModule {}
