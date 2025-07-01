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
import { LungsService } from 'src/app/elderly/lungs/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateLungsDto, UpdateLungsDto } from 'src/app/elderly/lungs/dtos';
import { ApiTags } from '@nestjs/swagger';
import { GetLungsDto } from '../../dtos/get-lugs.dto';

@ApiTags('Lungs')
@Controller({
  path: 'lungs',
  version: '1',
})
export class LungsHttpController {
  constructor(private readonly lungsService: LungsService) {}

  @Post()
  public async create(@Body() createLungsDto: CreateLungsDto) {
    try {
      const data = await this.lungsService.create(createLungsDto);
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
  public async index(@Query() paginateDto: GetLungsDto) {
    try {
      const data = await this.lungsService.paginate(paginateDto);
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
      const data = await this.lungsService.detail(id);

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
      const data = await this.lungsService.destroy(id);
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
    @Body() updateLungsDto: UpdateLungsDto,
  ) {
    try {
      const data = await this.lungsService.update(id, updateLungsDto);
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
