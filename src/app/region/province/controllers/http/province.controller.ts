import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ProvinceService } from '../../services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { ProvinceFilterDto } from '../../dtos';

@ApiTags('[API Region] Province')
@Controller({
  path: 'province',
  version: '1',
})
export class ProvinceHttpController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  public async index(@Query() provinceFilterDto: ProvinceFilterDto) {
    try {
      const data = await this.provinceService.findMany(provinceFilterDto);
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
      const data = await this.provinceService.detail(id);

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
