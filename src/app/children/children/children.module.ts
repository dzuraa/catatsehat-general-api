import { Module } from '@nestjs/common';
import {
  ChildrenAdminHttpController,
  ChildrenHttpController,
} from './controllers';
import { ChildrenAdminService, ChildrenService } from './services';
import { ChildrenRepository } from './repositories';
import { MotherModule } from '@/app/mother/mother';

@Module({
  imports: [MotherModule],
  controllers: [ChildrenAdminHttpController, ChildrenHttpController],
  providers: [ChildrenService, ChildrenAdminService, ChildrenRepository],
  exports: [ChildrenService, ChildrenAdminService, ChildrenRepository],
})
export class ChildrenModule {}
