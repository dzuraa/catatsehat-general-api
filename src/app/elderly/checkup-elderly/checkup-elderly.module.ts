import { Module } from '@nestjs/common';
import { CheckupElderlyHttpController } from './controllers';
import { CheckupElderlyService } from './services';
import { CheckupElderlyRepository } from './repositories';

@Module({
  controllers: [CheckupElderlyHttpController],
  providers: [CheckupElderlyService, CheckupElderlyRepository],
})
export class CheckupElderlyModule {}
