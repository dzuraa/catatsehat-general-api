import { AdminGuard } from '@/app/auth';
import { AdminDecorator } from '@/app/auth/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Admin } from '@prisma/client';
import {
  CreateCheckupMothersAdminDto,
  UpdateCheckupMotherDto,
} from 'src/app/mother/checkup-mother/dtos';
import { CheckupMothersAdminService } from 'src/app/mother/checkup-mother/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { Response } from 'express';
import { CheckupMotherSearchDto } from '../../dtos/search-checkup-mother.dto';

@ApiTags('CheckupMotherAdmin')
@UseGuards(AdminGuard)
@ApiSecurity('JWT')
@Controller({
  path: 'admin/checkupMother',
  version: '1',
})
export class CheckupMotherHttpController {
  constructor(
    private readonly checkupMotherAdminService: CheckupMothersAdminService,
  ) {}

  @Post()
  public async create(
    @Body() createCheckupMotherAdminDto: CreateCheckupMothersAdminDto,
    @AdminDecorator() admin: Admin,
  ) {
    try {
      const data = await this.checkupMotherAdminService.create(
        createCheckupMotherAdminDto,
        admin,
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
  public async index(@Query() paginateDto: CheckupMotherSearchDto) {
    try {
      const data = await this.checkupMotherAdminService.paginate(paginateDto);
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
      const data = await this.checkupMotherAdminService.detail(id);

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
      const data = await this.checkupMotherAdminService.destroy(id);
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
    @AdminDecorator() admin: Admin,
    @Body() updateCheckupMotherDto: UpdateCheckupMotherDto,
  ) {
    try {
      const data = await this.checkupMotherAdminService.update(
        id,
        updateCheckupMotherDto,
        admin,
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

  @Get('export')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=checkup_mother.xlsx')
  public async exportExcel(
    @Query() filterDto: CheckupMotherSearchDto,
    @Res() res: Response,
  ) {
    try {
      const buffer =
        await this.checkupMotherAdminService.exportExcel(filterDto);
      res.setHeader('Content-Length', Buffer.byteLength(buffer).toString());
      res.end(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
