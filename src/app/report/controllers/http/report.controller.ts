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
import { ReportAdminService, ReportService } from '../../services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateReportDto, UpdateReportDto, SearchReportDto } from '../../dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AdminGuard } from 'src/app/auth';
import { User } from '@prisma/client';
import { UserDecorator } from 'src/app/auth/decorators';
import { UpdateReportAdminDto } from '../../dtos/update-report-admin.dto';

@ApiTags('[USER] Report Stunting')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/report',
  version: '1',
})
export class ReportHttpController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  public async create(
    @Body() createReportDto: CreateReportDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.reportService.create(createReportDto, user);
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
    @Query() searchReportDto: SearchReportDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.reportService.paginate(searchReportDto, user);
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
      const data = await this.reportService.detail(id);

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
      const data = await this.reportService.destroy(id);
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
    @Body() updateReportsDto: UpdateReportDto,
  ) {
    try {
      const data = await this.reportService.update(id, updateReportsDto);
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

@ApiTags('[ADMIN] Report Stunting')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/report',
  version: '1',
})
export class ReportAdminHttpController {
  constructor(private readonly reportAdminService: ReportAdminService) {}

  @Get()
  public async index(@Query() searchReportDto: SearchReportDto) {
    try {
      const data = await this.reportAdminService.paginate(searchReportDto);
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
      const data = await this.reportAdminService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateReportAdminDto: UpdateReportAdminDto,
  ) {
    try {
      const data = await this.reportAdminService.update(
        id,
        updateReportAdminDto,
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
