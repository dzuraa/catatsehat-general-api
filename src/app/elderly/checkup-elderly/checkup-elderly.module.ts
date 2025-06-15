import { Module } from '@nestjs/common';
import { CheckupElderlyHttpController } from './controllers';
import { CheckupElderlyAdminHttpController } from './controllers/http/checkup-elderly-admin.controller';
import { CheckupElderlyService } from './services';
import { CheckupElderlyRepository } from './repositories';

@Module({
  controllers: [
    CheckupElderlyHttpController,
    CheckupElderlyAdminHttpController,
  ],
  providers: [CheckupElderlyService, CheckupElderlyRepository],
})
export class CheckupElderlyModule {}
