import { Controller, Get, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthModule } from './auth';
import { SubdistrictModule } from './subdistrict';
import { DistrictModule } from './district';
import { RegencyModule } from './regency';
import { ProvinceModule } from './province';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
