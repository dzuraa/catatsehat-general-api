import { Module } from '@nestjs/common';
import { MasterDataLungsHttpController } from './controllers';
import { MasterDataLungsService } from './services';
import { MasterDataLungsRepository } from './repositories';

@Module({
  controllers: [MasterDataLungsHttpController],
  providers: [MasterDataLungsService, MasterDataLungsRepository],
})
export class MasterDataLungsModule {}
