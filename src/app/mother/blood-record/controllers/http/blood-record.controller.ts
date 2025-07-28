import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BloodRecordService } from 'src/app/mother/blood-record/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthGuard } from '@/app/auth';
import { Admin, User } from '@prisma/client';
import { AdminDecorator, UserDecorator } from '@/app/auth/decorators';
import { BloodRecordAdminService } from '../../services/blood-record-admin.service';
import {
  BloodRecordSearchDto,
  CreateBloodRecordDto,
  UpdateBloodRecordDto,
} from '../../dtos';
import { BloodRecordPublicService } from '../../services/blood-record-public.service';

@ApiTags('[ADMIN] Blood Record')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/bloodRecord',
  version: '1',
})
export class BloodRecordAdminHttpController {
  constructor(
    private readonly bloodRecordAdminService: BloodRecordAdminService,
  ) {}

  @Post()
  public async create(
    @Body() createBloodRecordDto: CreateBloodRecordDto,
    @AdminDecorator() admin: Admin,
  ) {
    try {
      const data = await this.bloodRecordAdminService.create(
        createBloodRecordDto,
        admin,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.CREATED,
        message: 'Data created successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  public async index(@Query() paginateDto: BloodRecordSearchDto) {
    try {
      const data = await this.bloodRecordAdminService.paginate(paginateDto);
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
      const data = await this.bloodRecordAdminService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @AdminDecorator() admin: Admin,
    @Body() updateBloodRecordDto: UpdateBloodRecordDto,
  ) {
    try {
      const data = await this.bloodRecordAdminService.update(
        id,
        admin,
        updateBloodRecordDto,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data updated successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.bloodRecordAdminService.destroy(id);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data deleted successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@ApiTags('[PUBLIC] Blood Record')
@Controller({
  path: 'public/bloodRecord',
  version: '1',
})
export class BloodRecordPublicHttpController {
  constructor(
    private readonly bloodRecordPublicService: BloodRecordPublicService,
  ) {}

  @Post()
  public async create(@Body() createBloodRecordDto: CreateBloodRecordDto) {
    try {
      const data =
        await this.bloodRecordPublicService.create(createBloodRecordDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.CREATED,
        message: 'Data created successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@ApiTags('[USER] Blood Record')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/bloodRecord',
  version: '1',
})
export class BloodRecordHttpController {
  constructor(private readonly bloodRecordService: BloodRecordService) {}

  @Get()
  public async index(
    @Query() filterDto: BloodRecordSearchDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.bloodRecordService.index(filterDto, user);
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
      const data = await this.bloodRecordService.detail(id);

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
