import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { VaccineService } from 'src/app/children/vaccine/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { Filter } from '../../repositories';

@ApiTags('[DATAMASTER] Vaccine')
@Controller({
  path: 'vaccine',
  version: '1',
})
export class VaccineHttpController {
  constructor(private readonly vaccineService: VaccineService) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.vaccineService.find(filter);
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
      const data = await this.vaccineService.detail(id);

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
