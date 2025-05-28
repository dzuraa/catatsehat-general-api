import { Module } from '@nestjs/common';
import { MasterElderlyHttpController } from './controllers';
import { MasterElderlyService } from './services';
import { MasterElderlyRepository } from './repositories';

@Module({
  controllers: [MasterElderlyHttpController],
  providers: [MasterElderlyService, MasterElderlyRepository],
})
export class MasterElderlyModule {}
