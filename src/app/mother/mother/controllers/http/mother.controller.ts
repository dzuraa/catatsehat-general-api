import { AuthGuard } from '@/app/auth';
import { UserDecorator } from '@/app/auth/decorators';
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
import { User } from '@prisma/client';
import { CreateMotherDto, UpdateMotherDto } from 'src/app/mother/mother/dtos';
import { MotherService } from 'src/app/mother/mother/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';

@ApiTags('Mother')
@Controller({
  path: 'mother',
  version: '1',
})
export class MotherHttpController {
  constructor(private readonly motherService: MotherService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  public async create(
    @Body() createMotherDto: CreateMotherDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.motherService.create(createMotherDto, user);
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
      const data = await this.motherService.paginate(paginateDto);
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
      const data = await this.motherService.detail(id);

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
      const data = await this.motherService.destroy(id);
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
    @Body() updateMotherDto: UpdateMotherDto,
  ) {
    try {
      const data = await this.motherService.update(id, updateMotherDto);
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

@ApiTags('[ADMIN] Mother')
@ApiSecurity('JWT')
@Controller({
  path: 'motherqr',
  version: '1',
})
export class ParentsAdminHttpController {
  constructor(private readonly motherService: MotherService) {}

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.motherService.detail(id);

      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':code/code')
  public async detailByCode(@Param('code') code: string) {
    try {
      const data = await this.motherService.detailByCode(code);

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
