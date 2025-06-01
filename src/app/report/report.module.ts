import { Module } from '@nestjs/common';
import { ReportHttpController, ReportAdminHttpController } from './controllers';
import { ReportAdminService, ReportService } from './services';
import { ReportRepository } from './repositories';

@Module({
  controllers: [ReportAdminHttpController, ReportHttpController],
  providers: [ReportService, ReportAdminService, ReportRepository],
})
export class ReportModule {}
