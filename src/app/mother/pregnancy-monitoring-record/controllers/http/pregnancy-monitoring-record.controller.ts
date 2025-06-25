import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthGuard } from '@/app/auth';
import { UserDecorator } from '@/app/auth/decorators';
import { User } from '@prisma/client';
import {
  CreatePregnancyMonitoringRecordDto,
  SearchPregnancyMonitoringRecordDto,
} from '../../dtos';
import { PregnancyMonitoringRecordAdminService } from '../../services/pregnancy-monitoring-record-admin.service';
import { PregnancyMonitoringRecordService } from '../../services';

@ApiTags('[ADMIN] Pregnancy Monitoring Record')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/pregnancyMonitoringRecord',
  version: '1',
})
export class PregnancyMonitoringRecordAdminHttpController {
  constructor(
    private readonly pregnancyMonitoringRecordAdminService: PregnancyMonitoringRecordAdminService,
  ) {}

  @Get()
  public async index(@Query() paginateDto: SearchPregnancyMonitoringRecordDto) {
    try {
      const data =
        await this.pregnancyMonitoringRecordAdminService.paginate(paginateDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.pregnancyMonitoringRecordAdminService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

@ApiTags('[USER] Pregnancy Monitoring Record')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/pregnancyMonitoringRecord',
  version: '1',
})
export class PregnancyMonitoringRecordHttpController {
  constructor(
    private readonly pregnancyMonitoringRecordService: PregnancyMonitoringRecordService,
  ) {}

  @Post()
  public async create(
    @Body()
    createPregnancyMonitoringRecordDto: CreatePregnancyMonitoringRecordDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.pregnancyMonitoringRecordService.create(
        createPregnancyMonitoringRecordDto,
        user,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.CREATED,
        message: 'Data created successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  public async index(
    @Query('weekPregnancyMonitoringId') weekPregnancyMonitoringId: string,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.pregnancyMonitoringRecordService.index(
        weekPregnancyMonitoringId,
        user,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.pregnancyMonitoringRecordService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
