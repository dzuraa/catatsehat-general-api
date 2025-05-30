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
import { AdminService } from '@app/admin/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateAdminDto, UpdateAdminDto } from 'src/app/admin/dtos';
import { ApiTags } from '@nestjs/swagger';
import { ApiSecurity } from '@nestjs/swagger';
import { AdminRole } from 'src/common/enums/admin-role';
import { AdminGuard, RoleAllowed } from '@app/auth/guards';
import { AdminSearchDto } from '@app/admin/dtos';
import { HealthPostAdminSearchDto } from '../../dtos/search-healthpost-admin.dto';

@ApiSecurity('JWT')
@ApiTags('Admin')
@UseGuards(AdminGuard)
@RoleAllowed(AdminRole.SUPER_ADMIN)
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminHttpController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  public async create(@Body() createAdminDto: CreateAdminDto) {
    try {
      const data = await this.adminService.create(createAdminDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.CREATED,
        message: 'Admin created successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  public async index(@Query() paginateDto: AdminSearchDto) {
    try {
      const data = await this.adminService.paginate(paginateDto);
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
      const data = await this.adminService.detail(id);

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
      const data = await this.adminService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    try {
      const data = await this.adminService.update(id, updateAdminDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@ApiTags('[DATA] Kader Posyandu')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@RoleAllowed(AdminRole.SUPER_ADMIN, AdminRole.KADER)
@Controller({
  path: 'admin-kader',
  version: '1',
})
export class AdminPosyanduHttpController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  public async findMany(@Query() paginateDto: HealthPostAdminSearchDto) {
    try {
      const data = await this.adminService.findMany(paginateDto);
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
