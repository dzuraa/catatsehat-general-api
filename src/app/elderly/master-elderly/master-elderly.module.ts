import { Module } from '@nestjs/common';
import { MasterElderlyHttpController } from './controllers';
import { MasterElderlyService } from './services';
import { MasterElderlyRepository } from './repositories';
import { MasterElderlyAdminHttpController } from './controllers/http/master-elderly-admin.controller';

@Module({
  controllers: [MasterElderlyHttpController, MasterElderlyAdminHttpController],
  providers: [MasterElderlyService, MasterElderlyRepository],
})
export class MasterElderlyModule {}
