import { Module } from '@nestjs/common';
import { ProvinceHttpController } from './controllers';
import { ProvinceService } from './services';
import { ProvinceRepository } from './repositories';

@Module({
  controllers: [ProvinceHttpController],
  providers: [ProvinceService, ProvinceRepository],
})
export class ProvinceModule {}
