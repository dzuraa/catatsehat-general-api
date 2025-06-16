import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { VaccineStageService } from 'src/app/children/vaccine-stage/services';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@/common/entities/response.entity';
import { Filter } from '../../repositories';

@ApiTags('[DATAMASTER] VaccineStage')
@Controller({
  path: 'vaccineStage',
  version: '1',
})
export class VaccineStageHttpController {
  constructor(private readonly vaccineStageService: VaccineStageService) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.vaccineStageService.find(filter);
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
      const data = await this.vaccineStageService.detail(id);

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
