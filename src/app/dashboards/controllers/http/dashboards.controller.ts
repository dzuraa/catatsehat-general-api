import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  DashboardService,
  DashboardAdminService,
} from 'src/app/dashboards/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { AdminGuard } from '@app/auth/guards/admin.guard';
import { User } from '@prisma/client';
import { UserDecorator } from '@app/auth/decorators';

@ApiTags('[USER] Dashboards')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/dashboard',
  version: '1',
})
export class DashboardHttpController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  public async index(@UserDecorator() user: User) {
    try {
      const data = await this.dashboardService.findAll(user);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

@ApiTags('[ADMIN] Dashboards')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/dashboard',
  version: '1',
})
export class DashboardAdminHttpController {
  constructor(private readonly dashboardAdminService: DashboardAdminService) {}

  @Get()
  public async index() {
    try {
      const data = await this.dashboardAdminService.findAll();
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
