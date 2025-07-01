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
import { ResponseEntity } from 'src/common/entities/response.entity';
import {
  CreateImmunizationOptionalRecordDto,
  SearchImmunizationOptionalRecordDto,
  UpdateImmunizationOptionalRecordDto,
} from 'src/app/children/immunization-optional-record/dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ImmunizationOptionalRecordAdminService } from '../../services/immunization-optional-record-admin.service';
import { AdminGuard, AuthGuard } from '@/app/auth';
import { ImmunizationOptionalRecordService } from '../../services';

@ApiTags('[ADMIN] Immunization Optional Record')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/immunizationOptionalRecord',
  version: '1',
})
export class ImmunizationOptionalRecordAdminHttpController {
  constructor(
    private readonly immunizationOptionalRecordAdminService: ImmunizationOptionalRecordAdminService,
  ) {}

  @Post()
  public async create(
    @Body()
    createImmunizationOptionalRecordDto: CreateImmunizationOptionalRecordDto,
  ) {
    try {
      const data = await this.immunizationOptionalRecordAdminService.create(
        createImmunizationOptionalRecordDto,
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
    @Query() paginateDto: SearchImmunizationOptionalRecordDto,
  ) {
    try {
      const data =
        await this.immunizationOptionalRecordAdminService.paginate(paginateDto);
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
      const data = await this.immunizationOptionalRecordAdminService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  public async destroy(@Param('id') id: string) {
    try {
      const data =
        await this.immunizationOptionalRecordAdminService.destroy(id);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data deleted successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body()
    updateImmunizationOptionalRecordDto: UpdateImmunizationOptionalRecordDto,
  ) {
    try {
      const data = await this.immunizationOptionalRecordAdminService.update(
        id,
        updateImmunizationOptionalRecordDto,
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
}

@ApiTags('[USER] Immunization Optional Record')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/immunizationOptionalRecord',
  version: '1',
})
export class ImmunizationOptionalRecordHttpController {
  constructor(
    private readonly immunizationOptionalRecordService: ImmunizationOptionalRecordService,
  ) {}

  @Get()
  public async index(
    @Query() paginateDto: SearchImmunizationOptionalRecordDto,
    @Query('childrenId') childrenId: string,
  ) {
    try {
      const data = await this.immunizationOptionalRecordService.paginate(
        paginateDto,
        childrenId,
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
      const data = await this.immunizationOptionalRecordService.detail(id);

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
