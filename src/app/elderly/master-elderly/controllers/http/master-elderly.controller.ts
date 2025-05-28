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
} from '@nestjs/common';
import { MasterElderlyService } from 'src/app/elderly/master-elderly/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import {
  CreateMasterElderlyDto,
  UpdateMasterElderlyDto,
} from 'src/app/elderly/master-elderly/dtos';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserDecorator } from '@/app/auth/decorators';

@ApiTags('MasterElderly')
@Controller({
  path: 'elderly',
  version: '1',
})
export class MasterElderlyHttpController {
  constructor(private readonly elderlyService: MasterElderlyService) {}

  @Post()
  public async create(
    @Body() createMasterElderlyDto: CreateMasterElderlyDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.elderlyService.create(
        createMasterElderlyDto,
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
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data = await this.elderlyService.paginate(paginateDto);
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
      const data = await this.elderlyService.detail(id);

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
      const data = await this.elderlyService.destroy(id);
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
    @Body() updateMasterElderlyDto: UpdateMasterElderlyDto,
  ) {
    try {
      const data = await this.elderlyService.update(id, updateMasterElderlyDto);
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
