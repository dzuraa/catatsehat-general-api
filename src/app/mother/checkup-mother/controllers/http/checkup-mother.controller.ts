import { AdminGuard } from '@/app/auth';
import { AdminDecorator } from '@/app/auth/decorators';
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
import { Admin } from '@prisma/client';
import {
  CreateCheckupMothersAdminDto,
  UpdateCheckupMotherDto,
} from 'src/app/mother/checkup-mother/dtos';
import { CheckupMothersAdminService } from 'src/app/mother/checkup-mother/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';

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
  public async index(@Query() paginateDto: PaginationQueryDto) {
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

  @Get(':id')
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
}
