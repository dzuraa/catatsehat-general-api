import { Module } from '@nestjs/common';
import {
  CheckupChildrenAdminService,
  CheckupChildrenService,
} from './services';
import { CheckupChildrenRepository } from './repositories';
import { ChildrenModule } from '../children';
import { HealthPostModule } from '@/app/healthpost';
import { AdminModule } from '@/app/admin';
import {
  CheckupChildrenAdminHttpController,
  CheckupChildrenHttpController,
} from './controllers';

@Module({
  imports: [ChildrenModule, HealthPostModule, AdminModule],
  controllers: [
    CheckupChildrenAdminHttpController,
    CheckupChildrenHttpController,
  ],
  providers: [
    CheckupChildrenService,
    CheckupChildrenAdminService,
    CheckupChildrenRepository,
  ],
})
export class CheckupChildrenModule {}
