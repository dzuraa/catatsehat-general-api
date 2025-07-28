import { Module } from '@nestjs/common';
import { TrimesterHttpController } from './controllers';
import { TrimesterService } from './services';
import { TrimesterRepository } from './repositories';

@Module({
  controllers: [TrimesterHttpController],
  providers: [TrimesterService, TrimesterRepository],
})
export class TrimesterModule {}
