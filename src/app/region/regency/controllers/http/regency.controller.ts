import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { RegencyService } from '../../services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { RegencyFilterDto } from '../../dtos';

@ApiTags('[API Region] Regency')
@Controller({
  path: 'regency',
  version: '1',
})
export class RegencyHttpController {
  constructor(private readonly regencyService: RegencyService) {}

  @Get()
  public async index(@Query() regencyFilterDto: RegencyFilterDto) {
    try {
      const data = await this.regencyService.findMany(regencyFilterDto);
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
      const data = await this.regencyService.detail(id);

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
