import { Module } from '@nestjs/common';
import { LungsHttpController } from './controllers';
import { LungsService } from './services';
import { LungsRepository } from './repositories';

@Module({
  controllers: [LungsHttpController],
  providers: [LungsService, LungsRepository],
})
export class LungsModule {}
