import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { DistrictService } from 'src/app/district/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { DistrictFilterDto } from '../../dtos';

@ApiTags('[API Region] District')
@Controller({
  path: 'district',
  version: '1',
})
export class DistrictHttpController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  public async index(@Query() districtFilterDto: DistrictFilterDto) {
    try {
      const data = await this.districtService.findMany(districtFilterDto);
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
      const data = await this.districtService.detail(id);

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
