import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostpartumRecordService } from 'src/app/mother/postpartum-record/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';

@ApiTags('PostpartumRecord')
@Controller({
  path: 'postPartumRecord',
  version: '1',
})
export class PostpartumRecordHttpController {
  constructor(
    private readonly postPartumRecordService: PostpartumRecordService,
  ) {}

  @Get()
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data = await this.postPartumRecordService.paginate(paginateDto);
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
      const data = await this.postPartumRecordService.detail(id);

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
