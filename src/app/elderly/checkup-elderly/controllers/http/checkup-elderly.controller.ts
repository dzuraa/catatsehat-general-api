import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckupElderlyService } from 'src/app/elderly/checkup-elderly/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/app/auth';

@ApiTags('CheckupElderly')
@UseGuards(AuthGuard)
@Controller({
  path: 'checkupElderly',
  version: '1',
})
export class CheckupElderlyHttpController {
  constructor(private readonly checkupElderlyService: CheckupElderlyService) {}

  @Get()
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data = await this.checkupElderlyService.paginate(paginateDto);
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
      const data = await this.checkupElderlyService.detail(id);

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
