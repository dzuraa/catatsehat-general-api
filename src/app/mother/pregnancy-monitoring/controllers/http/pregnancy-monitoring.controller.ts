import { AuthGuard } from '@/app/auth';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreatePregnancyMonitoringAnswersDto } from 'src/app/mother/pregnancy-monitoring/dtos';
import { PregnancyMonitoringService } from 'src/app/mother/pregnancy-monitoring/services';
import { ResponseEntity } from 'src/common/entities/response.entity';

@ApiTags('PregnancyMonitoring')
@UseGuards(AuthGuard)
@ApiSecurity('JWT')
@Controller({
  path: 'pregnancyMonitoringAnswer',
  version: '1',
})
export class PregnancyMonitoringHttpController {
  constructor(
    private readonly pregnancyMonitoringAnswerService: PregnancyMonitoringService,
  ) {}

  @Post()
  public async create(
    @Body()
    createPregnancyMonitoringAnswerDto: CreatePregnancyMonitoringAnswersDto,
  ) {
    try {
      const data =
        await this.pregnancyMonitoringAnswerService.submitPregnancyMonitoringAnswers(
          createPregnancyMonitoringAnswerDto,
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

  @Get('record')
  public async recordByWeek(
    @Query('weekPregnancyMonitoringId') weekPregnancyMonitoringId: string,
    @Query('motherId') motherId: string,
  ) {
    try {
      const data =
        await this.pregnancyMonitoringAnswerService.findRecordByWeekId(
          weekPregnancyMonitoringId,
          motherId,
        );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('answer')
  public async index(
    @Query('pregnancyMonitoringRecordId') pregnancyMonitoringRecordId: string,
  ) {
    try {
      const data =
        await this.pregnancyMonitoringAnswerService.findAnswerByRecordId(
          pregnancyMonitoringRecordId,
        );
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
      const data = await this.pregnancyMonitoringAnswerService.detail(id);

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
