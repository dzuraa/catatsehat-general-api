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
import { ChildrenService } from 'src/app/children/children/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import {
  CreateChildrenDto,
  UpdateChildrenDto,
} from 'src/app/children/children/dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/app/auth/decorators';
import { User } from '@prisma/client';
import { AdminGuard, AuthGuard, RoleAllowed } from '@/app/auth';
import { AdminRole } from '@/common/enums/admin-role';
import { SearchChildrenDto } from '../../dtos/search-children.dto';
import { ChildrenAdminService } from '../../services/children-admin.service';

@ApiTags('[USER] Children')
@UseGuards(AuthGuard)
@ApiSecurity('JWT')
@Controller({
  path: 'user/children',
  version: '1',
})
export class ChildrenHttpController {
  constructor(private readonly childService: ChildrenService) {}

  @Post()
  public async create(
    @Body() createChildrenDto: CreateChildrenDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.childService.create(createChildrenDto, user);
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
  public async index(
    @Query() paginateDto: SearchChildrenDto,
    @UserDecorator() user: User,
  ) {
    try {
      const data = await this.childService.paginate(paginateDto, user);
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
      const data = await this.childService.detail(id);

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
      const data = await this.childService.destroy(id);
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
    @Body() updateChildrenDto: UpdateChildrenDto,
  ) {
    try {
      const data = await this.childService.update(id, updateChildrenDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data updated successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/refresh-code')
  async refreshCode(@Param('id') id: string) {
    try {
      const data = await this.childService.refreshCode(id);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Code refreshed successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}

@ApiTags('[ADMIN] Children')
@UseGuards(AdminGuard)
@RoleAllowed(AdminRole.SUPER_ADMIN, AdminRole.KADER)
@ApiSecurity('JWT')
@Controller({
  path: 'admin/children',
  version: '1',
})
export class ChildrenAdminHttpController {
  constructor(private readonly childrenAdminService: ChildrenAdminService) {}

  @Get()
  public async index(@Query() searchChildrenDto: SearchChildrenDto) {
    try {
      const data = await this.childrenAdminService.paginate(searchChildrenDto);
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
      const data = await this.childrenAdminService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':code/code')
  public async detailByCode(@Param('code') code: string) {
    try {
      const data = await this.childrenAdminService.detailByCode(code);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/refresh-code')
  async refreshCode(@Param('id') id: string) {
    try {
      const data = await this.childrenAdminService.refreshCode(id);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Code refreshed successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
