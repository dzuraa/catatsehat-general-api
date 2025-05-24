import { forwardRef, Module } from '@nestjs/common';
import { AdminHttpController } from './controllers';
import { AdminService } from './services';
import { AdminRepository } from './repositories';
import { AuthModule } from '../auth';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AdminHttpController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
