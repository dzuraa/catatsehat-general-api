import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostPartumService } from 'src/app/mother/post-partum/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreatePostPartumAnswersDto } from '../../dtos';

@ApiTags('PostPartum')
@Controller({
  path: 'postPartum',
  version: '1',
})
export class PostPartumHttpController {
  constructor(private readonly postPartumAnswerService: PostPartumService) {}

  @Post()
  public async create(@Body() createPostPartumDto: CreatePostPartumAnswersDto) {
    try {
      const data =
        await this.postPartumAnswerService.submitPostPartumAnswers(
          createPostPartumDto,
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
  public async recordByDay(@Query('dayPostPartumId') dayPostPartumId: string) {
    try {
      const data =
        await this.postPartumAnswerService.findAnswerByRecordId(
          dayPostPartumId,
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
  public async index(@Query('postPartumRecordId') postPartumRecordId: string) {
    try {
      const data =
        await this.postPartumAnswerService.findAnswerByRecordId(
          postPartumRecordId,
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
      const data = await this.postPartumAnswerService.detail(id);

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
