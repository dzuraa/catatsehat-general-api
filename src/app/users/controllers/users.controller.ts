import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth/guards';

@ApiTags('Users')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user',
  version: '1',
})
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Post()
  // public async create(@Body() createUsersDto: CreateUsersDto) {
  //   try {
  //     const data = await this.userService.create(createUsersDto);
  //     return new ResponseEntity({
  //       data,
  //       message: 'success',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get()
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data = await this.userService.paginate(paginateDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.userService.detail(id);

      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.userService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Put(':id')
  // public async update(
  //   @Param('id') id: string,
  //   @Body() updateUsersDto: UpdateUsersDto,
  // ) {
  //   try {
  //     const data = await this.userService.update(id, updateUsersDto);
  //     return new ResponseEntity({
  //       data,
  //       message: 'success',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
