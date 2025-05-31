import { forwardRef, Module } from '@nestjs/common';
import {
  AdminHttpController,
  HealthPostAdminHttpController,
} from './controllers';
import { AdminService } from './services';
import { AdminRepository } from './repositories';
import { AuthModule } from '../auth';
import { HealthPostModule } from '../healthpost';

@Module({
  imports: [forwardRef(() => AuthModule), HealthPostModule],
  controllers: [AdminHttpController, HealthPostAdminHttpController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
