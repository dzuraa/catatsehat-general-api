import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { MonthBloodService } from 'src/app/mother/month-blood/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { Filter } from '../../repositories';

@ApiTags('MonthBlood')
@Controller({
  path: 'monthBlood',
  version: '1',
})
export class MonthBloodHttpController {
  constructor(private readonly monthBloodService: MonthBloodService) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.monthBloodService.find(filter);
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
      const data = await this.monthBloodService.detail(id);

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
