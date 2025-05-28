import { Module } from '@nestjs/common';
import { ChildrenHttpController } from './controllers';
import { ChildrenService } from './services';
import { ChildrenRepository } from './repositories';

@Module({
  controllers: [ChildrenHttpController],
  providers: [ChildrenService, ChildrenRepository],
})
export class ChildrenModule {}
