import {
  // Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  // Post,
  // Put,
  Query,
} from '@nestjs/common';
import { ChildrenService } from 'src/app/children/children/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
// import {
//   CreateChildrenDto,
//   UpdateChildrenDto,
// } from 'src/app/children/children/dtos';
import { ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '@/app/auth/decorators';
import { User } from '@prisma/client';

@ApiTags('Children')
@Controller({
  path: 'children',
  version: '1',
})
export class ChildrenHttpController {
  constructor(private readonly childrenService: ChildrenService) {}

  // @Post()
  // public async create(@Body() createChildrenDto: CreateChildrenDto) {
  //   try {
  //     const data = await this.childrenService.create(createChildrenDto);
  //     return new ResponseEntity({
  //       data,
  //       status: HttpStatus.CREATED,
  //       message: 'Data created successfully',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get()
  public async index(
    @Query() paginateDto: PaginationQueryDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.childrenService.paginate(paginateDto, user);
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
      const data = await this.childrenService.detail(id);

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
      const data = await this.childrenService.destroy(id);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data deleted successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Put(':id')
  // public async update(
  //   @Param('id') id: string,
  //   @Body() updateChildrenDto: UpdateChildrenDto,
  // ) {
  //   try {
  //     const data = await this.childrenService.update(id, updateChildrenDto);
  //     return new ResponseEntity({
  //       data,
  //       status: HttpStatus.OK,
  //       message: 'Data updated successfully',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
