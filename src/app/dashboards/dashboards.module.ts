import { Module } from '@nestjs/common';
import {
  DashboardHttpController,
  DashboardAdminHttpController,
} from './controllers';
import { DashboardService, DashboardAdminService } from './services';
import { ScheduleModule } from '../schedule';
import { ArticleModule } from '../article';
import { UsersModule } from '../users';
import { ChildrenModule } from '../children/children';
import { CheckupChildrenModule } from '../children/checkup-children';
import { CheckupMotherModule } from '../mother/checkup-mother';

@Module({
  imports: [
    ScheduleModule,
    ArticleModule,
    ChildrenModule,
    UsersModule,
    CheckupChildrenModule,
    CheckupMotherModule,
  ],
  controllers: [DashboardAdminHttpController, DashboardHttpController],
  providers: [DashboardService, DashboardAdminService],
})
export class DashboardModule {}
