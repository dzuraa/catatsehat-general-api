import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DayPostPartumService } from 'src/app/mother/day-postpartum/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { Filter } from '../../repositories';

@ApiTags('DayPostpartum')
@Controller({
  path: 'dayPostPartum',
  version: '1',
})
export class DayPostpartumHttpController {
  constructor(private readonly dayPostPartumService: DayPostPartumService) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.dayPostPartumService.find(filter);
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
      const data = await this.dayPostPartumService.detail(id);

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
