import { Controller, Get, Module } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { StorageModule } from 'src/platform/storage/storage.module';
import { ArticleModule } from './article';
import { AuthModule } from './auth';
import { CheckupChildrenModule } from './children/checkup-children';
import { ChildrenModule } from './children/children';
import { DashboardModule } from './dashboards';
import { CheckupElderlyModule } from './elderly/checkup-elderly';
import { MasterElderlyModule } from './elderly/master-elderly';
import { FileModule } from './file';
import { HealthPostModule } from './healthpost';
import { CheckupMotherModule } from './mother/checkup-mother';
import { DayPostpartumModule } from './mother/day-postpartum';
import { MotherModule } from './mother/mother';
import { PostpartumQuestionModule } from './mother/postpartum-question';
import { PostpartumRecordModule } from './mother/postpartum-record';
import { PregnancyMonitoringQuestionModule } from './mother/pregnancy-monitoring-question';
import { PregnancyMonitoringRecordModule } from './mother/pregnancy-monitoring-record';
import { WeekPregnancyMonitoringModule } from './mother/week-pregnancy-monitoring';
import { DistrictModule } from './region/district';
import { ProvinceModule } from './region/province';
import { RegencyModule } from './region/regency';
import { SubdistrictModule } from './region/subdistrict';
import { ReportModule } from './report';
import { ScheduleModule } from './schedule';
import { UsersModule } from './users/users.module';
import { ImmunizationRecordModule } from './children/immunization-record';
import { VaccineModule } from './children/vaccine';
import { VaccineStageModule } from './children/vaccine-stage';
import { BloodRecordModule } from './mother/blood-record';
import { MasterDataLungsModule } from './elderly/master-data-lungs';
import { LungConclusionModule } from './elderly/lung-conclusion';
import { LungsModule } from './elderly/lungs';
import { MonthBloodModule } from './mother/month-blood';
import { ImmunizationOptionalRecordModule } from './children/immunization-optional-record';
import { TrimesterModule } from './mother/trimester';

@ApiTags('App Spec')
@Controller()
class AppController {
  constructor() {}

  @Get()
  getHello() {
    return new ResponseEntity({
      data: {
        appVersion: 1,
        swaggerUrl: '/api',
      },
    });
  }
}

@Module({
  imports: [
    // Global modules
    FileModule,
    StorageModule,
    // Feature modules
    AuthModule,
    UsersModule,
    DashboardModule,
    ChildrenModule,
    CheckupChildrenModule,
    ImmunizationRecordModule,
    ImmunizationOptionalRecordModule,
    VaccineModule,
    VaccineStageModule,
    MasterElderlyModule,
    CheckupElderlyModule,
    MotherModule,
    CheckupMotherModule,
    BloodRecordModule,
    PostpartumRecordModule,
    PregnancyMonitoringRecordModule,
    PostpartumQuestionModule,
    PregnancyMonitoringQuestionModule,
    DayPostpartumModule,
    WeekPregnancyMonitoringModule,
    MonthBloodModule,
    HealthPostModule,
    ScheduleModule,
    ReportModule,
    ArticleModule,
    SubdistrictModule,
    DistrictModule,
    RegencyModule,
    ProvinceModule,
    CheckupElderlyModule,
    ArticleModule,
    ReportModule,
    MasterElderlyModule,
    HealthPostModule,
    ScheduleModule,
    ChildrenModule,
    CheckupMotherModule,
    MotherModule,
    // PostPartumModule,
    PostpartumRecordModule,
    PostpartumQuestionModule,
    DayPostpartumModule,
    // BloodRecordModule,
    // BloodStepModule,
    // MonthBloodModule,
    // BloodSupplementModule,
    // PregnancyMonitoringModule,
    PregnancyMonitoringRecordModule,
    PregnancyMonitoringQuestionModule,
    WeekPregnancyMonitoringModule,
    TrimesterModule,
    MasterDataLungsModule,
    LungConclusionModule,
    LungsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
