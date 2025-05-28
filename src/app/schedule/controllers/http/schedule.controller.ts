import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ScheduleService, ScheduleServiceAdmin } from '../../services';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  SearchScheduleDto,
} from '../../dtos';
import { AdminGuard, RoleAllowed } from 'src/app/auth';
import { AdminRole } from 'src/common/enums/admin-role';

@ApiTags('[ADMIN] Schedule')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@RoleAllowed(AdminRole.SUPER_ADMIN, AdminRole.KADER)
@Controller({
  path: 'admin/schedule',
  version: '1',
})
export class ScheduleHttpControllerAdmin {
  constructor(private readonly scheduleServiceAdmin: ScheduleServiceAdmin) {}

  @Post()
  public async create(@Body() createScheduleDto: CreateScheduleDto) {
    try {
      const data = await this.scheduleServiceAdmin.create(createScheduleDto);
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
  public async index(@Query() paginateDto: SearchScheduleDto) {
    try {
      const data = await this.scheduleServiceAdmin.paginate(paginateDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.scheduleServiceAdmin.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.scheduleServiceAdmin.destroy(id);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data deleted successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    try {
      const data = await this.scheduleServiceAdmin.update(
        id,
        updateScheduleDto,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data updated successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@ApiTags('[USER] Schedule')
@Controller({
  path: 'user/schedule',
  version: '1',
})
export class ScheduleHttpController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  public async index(@Query() paginateDto: SearchScheduleDto) {
    try {
      const data = await this.scheduleService.paginate(paginateDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.scheduleService.detail(id);

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
