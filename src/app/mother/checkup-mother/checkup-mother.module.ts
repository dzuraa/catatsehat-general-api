import { AdminRepository } from '@/app/admin/repositories';
import { HealthPostModule } from '@/app/healthpost';
import { Module } from '@nestjs/common';
import { MotherModule } from '../mother';
import { CheckupMotherHttpController } from './controllers';
import {
  CheckupMotherPublicHttpController,
  CheckupMothersHttpController,
} from './controllers/http/checkup-mother-public.controller';
import { CheckupMotherRepository } from './repositories';
import {
  CheckupMothersAdminService,
  CheckupMothersPublicService,
} from './services';

@Module({
  imports: [HealthPostModule, MotherModule],
  controllers: [
    CheckupMotherHttpController,
    CheckupMotherPublicHttpController,
    CheckupMothersHttpController,
  ],
  providers: [
    CheckupMothersAdminService,
    CheckupMothersPublicService,
    CheckupMotherRepository,
    AdminRepository,
  ],
  exports: [CheckupMothersAdminService, CheckupMothersPublicService],
})
export class CheckupMotherModule {}
