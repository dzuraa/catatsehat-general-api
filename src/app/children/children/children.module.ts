import { Module } from '@nestjs/common';
import {
  ChildrenAdminHttpController,
  ChildrenHttpController,
} from './controllers';
import { ChildrenAdminService, ChildrenService } from './services';
import { ChildrenRepository } from './repositories';
import { MotherModule } from '@/app/mother/mother';
import { ChildrenSeederService } from './services/children-seeder.service';
import { VaccineModule } from '../vaccine';
import { ChildVaccineModule } from '../child-vaccine';
import { ChildVaccineStageModule } from '../child-vaccine-stage';

@Module({
  imports: [
    MotherModule,
    VaccineModule,
    ChildVaccineModule,
    ChildVaccineStageModule,
  ],
  controllers: [ChildrenAdminHttpController, ChildrenHttpController],
  providers: [
    ChildrenService,
    ChildrenAdminService,
    ChildrenSeederService,
    ChildrenRepository,
  ],
  exports: [ChildrenService, ChildrenAdminService, ChildrenRepository],
})
export class ChildrenModule {}
