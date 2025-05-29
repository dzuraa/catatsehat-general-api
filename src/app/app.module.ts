import { Controller, Get, Module } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ArticleModule } from './article';
import { AuthModule } from './auth';
import { ChildrenModule } from './children/children';
import { CheckupElderlyModule } from './elderly/checkup-elderly';
import { MasterElderlyModule } from './elderly/master-elderly';
import { HealthPostModule } from './healthpost';
import { CheckupMotherModule } from './mother/checkup-mother';
import { MotherModule } from './mother/mother';
import { PostPartumModule } from './mother/post-partum';
import { PostpartumQuestionModule } from './mother/postpartum-question';
import { PostpartumRecordModule } from './mother/postpartum-record';
import { DistrictModule } from './region/district';
import { ProvinceModule } from './region/province';
import { RegencyModule } from './region/regency';
import { SubdistrictModule } from './region/subdistrict';
import { ScheduleModule } from './schedule';
import { UsersModule } from './users/users.module';
import { StorageModule } from 'src/platform/storage/storage.module';
import { FileModule } from './file';

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
    ChildrenModule,
    SubdistrictModule,
    DistrictModule,
    RegencyModule,
    ProvinceModule,
    CheckupElderlyModule,
    ArticleModule,
    MasterElderlyModule,
    HealthPostModule,
    ScheduleModule,
    ChildrenModule,
    CheckupMotherModule,
    MotherModule,
    PostPartumModule,
    PostpartumRecordModule,
    PostpartumQuestionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
