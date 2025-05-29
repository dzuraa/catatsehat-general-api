import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostpartumQuestionService } from 'src/app/mother/postpartum-question/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { Filter } from '../../repositories';

@ApiTags('PostpartumQuestion')
@Controller({
  path: 'postPartumQuestion',
  version: '1',
})
export class PostpartumQuestionHttpController {
  constructor(
    private readonly postPartumQuestionService: PostpartumQuestionService,
  ) {}

  @Get()
  public async index(@Query() filter: Filter) {
    try {
      const data = await this.postPartumQuestionService.find(filter);
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
      const data = await this.postPartumQuestionService.detail(id);

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
