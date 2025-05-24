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
import { CheckupElderlyService } from 'src/app/elderly/checkup-elderly/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import {
  CreateCheckupElderlyDto,
  UpdateCheckupElderlyDto,
} from 'src/app/elderly/checkup-elderly/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CheckupElderly')
@Controller({
  path: 'checkupElderly',
  version: '1',
})
export class CheckupElderlyHttpController {
  constructor(private readonly checkupElderlyService: CheckupElderlyService) {}

  @Post()
  public async create(
    @Body() createCheckupElderlyDto: CreateCheckupElderlyDto,
  ) {
    try {
      const data = await this.checkupElderlyService.create(
        createCheckupElderlyDto,
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
      const data = await this.checkupElderlyService.paginate(paginateDto);
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
      const data = await this.checkupElderlyService.detail(id);

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
      const data = await this.checkupElderlyService.destroy(id);
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
    @Body() updateCheckupElderlyDto: UpdateCheckupElderlyDto,
  ) {
    try {
      const data = await this.checkupElderlyService.update(
        id,
        updateCheckupElderlyDto,
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
