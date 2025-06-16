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
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ImmunizationRecordService } from '../../services';
import { AdminGuard, AuthGuard } from '@/app/auth';
import {
  CreateImmunizationArrayDto,
  SearchImmunizationRecordDto,
  UpdateImmunizationRecordDto,
} from '../../dtos';
import { ImmunizationRecordAdminService } from '../../services/immunization-record-admin.service';

@ApiTags('[ADMIN] Immunizations')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@Controller({
  path: 'admin/immunization',
  version: '1',
})
export class ImmunizationRecordAdminHttpController {
  constructor(
    private readonly immunizationRecordAdminService: ImmunizationRecordAdminService,
  ) {}

  @Post('bulk-create')
  async bulkCreate(
    @Body() createImmunizationsArrayDto: CreateImmunizationArrayDto,
  ) {
    try {
      const result = await this.immunizationRecordAdminService.bulkCreate(
        createImmunizationsArrayDto,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Immunization data saved successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Failed to save immunization data',
      };
    }
  }

  @Get()
  public async index(@Query() paginateDto: SearchImmunizationRecordDto) {
    try {
      const data =
        await this.immunizationRecordAdminService.paginate(paginateDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.immunizationRecordAdminService.detail(id);

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
      const data = await this.immunizationRecordAdminService.destroy(id);
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
    @Body() updateImmunizationsDto: UpdateImmunizationRecordDto,
  ) {
    try {
      const data = await this.immunizationRecordAdminService.update(
        id,
        updateImmunizationsDto,
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

  @Get('/by-code')
  public async indexByUser(
    @Query() paginateDto: PaginationQueryDto,
    @Query('code') code: string,
  ) {
    try {
      if (!code) {
        throw new HttpException('code is required', HttpStatus.BAD_REQUEST);
      }

      const data = await this.immunizationRecordAdminService.paginateByCode(
        paginateDto,
        code,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

@ApiTags('[USER] Immunization')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/immunization',
  version: '1',
})
export class ImmunizationHttpController {
  constructor(
    private readonly immunizationRecordService: ImmunizationRecordService,
  ) {}

  @Get()
  public async index(
    @Query() paginateDto: PaginationQueryDto,
    @Query('childId') childId?: string,
  ) {
    try {
      const data = await this.immunizationRecordService.paginate(
        paginateDto,
        childId,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.immunizationRecordService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('children/:childrenId/vaccines')
  @ApiOperation({ summary: 'Get all vaccines for a child' })
  @ApiParam({ name: 'childrenId', required: true })
  public async getChildVaccines(@Param('childrenId') childrenId: string) {
    try {
      const data =
        await this.immunizationRecordService.getChildVaccines(childrenId);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Vaccines fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('children/:childrenId/vaccine/:vaccineId/stages')
  @ApiOperation({ summary: 'Get vaccine stages detail for a child' })
  @ApiParam({ name: 'childrenId', required: true })
  @ApiParam({ name: 'vaccineId', required: true })
  public async getVaccineStagesDetail(
    @Param('childrenId') childrenId: string,
    @Param('vaccineId') vaccineId: string,
  ) {
    try {
      const data = await this.immunizationRecordService.getVaccineStagesDetail(
        childrenId,
        vaccineId,
      );

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Vaccine stages fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
