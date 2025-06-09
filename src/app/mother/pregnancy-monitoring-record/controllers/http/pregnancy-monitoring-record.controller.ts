import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PregnancyMonitoringRecordService } from 'src/app/mother/pregnancy-monitoring-record/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';

@ApiTags('PregnancyMonitoringRecord')
@Controller({
  path: 'pregnancyMonitoringRecord',
  version: '1',
})
export class PregnancyMonitoringRecordHttpController {
  constructor(
    private readonly pregnancyMonitoringRecordService: PregnancyMonitoringRecordService,
  ) {}

  @Get()
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data =
        await this.pregnancyMonitoringRecordService.paginate(paginateDto);
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
      const data = await this.pregnancyMonitoringRecordService.detail(id);

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
