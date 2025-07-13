import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PostpartumRecordAdminService } from '../../services/postpartum-record-admin.service';
import { AdminGuard, AuthGuard } from '@/app/auth';
import {
  CreatePostpartumRecordDto,
  FilterPostpartumRecordDto,
  SearchPostpartumRecordDto,
} from '../../dtos';
import { PostpartumRecordService } from '../../services';
import { UserDecorator } from '@/app/auth/decorators';
import { User } from '@prisma/client';

@ApiTags('[ADMIN] Postpartum Record')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/postPartumRecord',
  version: '1',
})
export class PostpartumRecordAdminHttpController {
  constructor(
    private readonly postPartumRecordAdminService: PostpartumRecordAdminService,
  ) {}

  @Get()
  public async index(@Query() paginateDto: SearchPostpartumRecordDto) {
    try {
      const data =
        await this.postPartumRecordAdminService.paginate(paginateDto);
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
      const data = await this.postPartumRecordAdminService.detail(id);

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

@ApiTags('[USER] Postpartum Record')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/postPartumRecord',
  version: '1',
})
export class PostpartumRecordHttpController {
  constructor(
    private readonly postPartumRecordService: PostpartumRecordService,
  ) {}

  @Post()
  public async create(
    @Body() createPostpartumRecordDto: CreatePostpartumRecordDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.postPartumRecordService.create(
        createPostpartumRecordDto,
        user,
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

  @Get()
  public async index(
    @Query() filterPostPartum: FilterPostpartumRecordDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.postPartumRecordService.index(
        filterPostPartum,
        user,
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

  @Get('/day-used')
  public async getDayUsed(@UserDecorator() user: User) {
    try {
      const data = await this.postPartumRecordService.getDayUsed(user);
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
