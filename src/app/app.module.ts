import { Controller, Get, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthModule } from './auth';
import { SubdistrictModule } from './region/subdistrict';
import { DistrictModule } from './region/district';
import { RegencyModule } from './region/regency';
import { ProvinceModule } from './region/province';
import { CheckupElderlyModule } from './elderly/checkup-elderly';
import { ArticleModule } from './article';
import { MasterElderlyModule } from './elderly/master-elderly';
import { HealthPostModule } from './healthpost';
import { ScheduleModule } from './schedule';

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
    UsersModule,
    AuthModule,
    SubdistrictModule,
    DistrictModule,
    RegencyModule,
    ProvinceModule,
    CheckupElderlyModule,
    ArticleModule,
    MasterElderlyModule,
    HealthPostModule,
    ScheduleModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
