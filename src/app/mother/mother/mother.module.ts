import { Module } from '@nestjs/common';
import { MotherHttpController } from './controllers';
import { MotherRepository } from './repositories';
import { MotherService, PostPartumSeederService } from './services';

@Module({
  controllers: [MotherHttpController],
  providers: [MotherService, MotherRepository, PostPartumSeederService],
  exports: [MotherService, MotherRepository],
})
export class MotherModule {}
