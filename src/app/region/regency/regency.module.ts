import { Module } from '@nestjs/common';
import { RegencyHttpController } from './controllers';
import { RegencyService } from './services';
import { RegencyRepository } from './repositories';

@Module({
  controllers: [RegencyHttpController],
  providers: [RegencyService, RegencyRepository],
})
export class RegencyModule {}
