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
} from '@nestjs/common';
import { MasterDataLungsService } from 'src/app/elderly/master-data-lungs/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import {
  CreateMasterDataLungsDto,
  UpdateMasterDataLungsDto,
} from 'src/app/elderly/master-data-lungs/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MasterDataLungs')
@Controller({
  path: 'masterDataLungs',
  version: '1',
})
export class MasterDataLungsHttpController {
  constructor(
    private readonly masterDataLungsService: MasterDataLungsService,
  ) {}

  @Post()
  public async create(
    @Body() createMasterDataLungsDto: CreateMasterDataLungsDto,
  ) {
    try {
      const data = await this.masterDataLungsService.create(
        createMasterDataLungsDto,
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
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data = await this.masterDataLungsService.paginate(paginateDto);
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
      const data = await this.masterDataLungsService.detail(id);

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
      const data = await this.masterDataLungsService.destroy(id);
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
    @Body() updateMasterDataLungsDto: UpdateMasterDataLungsDto,
  ) {
    try {
      const data = await this.masterDataLungsService.update(
        id,
        updateMasterDataLungsDto,
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
