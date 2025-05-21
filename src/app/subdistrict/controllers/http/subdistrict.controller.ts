import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { SubdistrictService } from 'src/app/subdistrict/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { SubDistrictFilterDto } from '../../dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('[API Region] Sub District')
@Controller({
  path: 'subDistrict',
  version: '1',
})
export class SubdistrictHttpController {
  constructor(private readonly subDistrictService: SubdistrictService) {}

  @Get()
  public async index(@Query() subDistrictFilterDto: SubDistrictFilterDto) {
    try {
      const data = await this.subDistrictService.findMany(subDistrictFilterDto);
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
      const data = await this.subDistrictService.detail(id);

      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
