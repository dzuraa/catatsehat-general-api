import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PregnancyMonitoringQuestionService } from 'src/app/mother/pregnancy-monitoring-question/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { Filter } from '../../repositories';

@ApiTags('PregnancyMonitoringQuestion')
@Controller({
  path: 'pregnancyMonitoringQuestion',
  version: '1',
})
export class PregnancyMonitoringQuestionHttpController {
  constructor(
    private readonly pregnancyMonitoringQuestionService: PregnancyMonitoringQuestionService,
  ) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.pregnancyMonitoringQuestionService.find(filter);
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
      const data = await this.pregnancyMonitoringQuestionService.detail(id);

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
