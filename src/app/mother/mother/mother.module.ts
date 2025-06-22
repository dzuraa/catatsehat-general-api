import { Module } from '@nestjs/common';
import {
  MotherAdminHttpController,
  MotherHttpController,
  MotherPublicHttpController,
} from './controllers';
import { MotherRepository } from './repositories';
import { MotherService } from './services';

@Module({
  controllers: [
    MotherHttpController,
    MotherAdminHttpController,
    MotherPublicHttpController,
  ],
  providers: [MotherService, MotherRepository],
  exports: [MotherService, MotherRepository],
})
export class MotherModule {}
