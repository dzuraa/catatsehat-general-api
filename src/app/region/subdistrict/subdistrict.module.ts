import { Module } from '@nestjs/common';
import { SubdistrictHttpController } from './controllers';
import { SubdistrictService } from './services';
import { SubdistrictRepository } from './repositories';

@Module({
  controllers: [SubdistrictHttpController],
  providers: [SubdistrictService, SubdistrictRepository],
})
export class SubdistrictModule {}
