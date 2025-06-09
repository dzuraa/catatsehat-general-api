import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WeekPregnancyMonitoringService } from 'src/app/mother/week-pregnancy-monitoring/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { Filter } from '../../repositories';

@ApiTags('WeekPregnancyMonitoring')
@Controller({
  path: 'weekPregnancyMonitoring',
  version: '1',
})
export class WeekPregnancyMonitoringHttpController {
  constructor(
    private readonly weekPregnancyMonitoringService: WeekPregnancyMonitoringService,
  ) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.weekPregnancyMonitoringService.find(filter);
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
      const data = await this.weekPregnancyMonitoringService.detail(id);

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
