import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ResponseEntity } from 'src/common/entities/response.entity';
import {
  CreateCheckupChildrenDto,
  UpdateCheckupChildrenDto,
} from 'src/app/children/checkup-children/dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthGuard, RoleAllowed } from '@/app/auth';
import { AdminRole } from '@/common/enums/admin-role';
import { SearchCheckupChildrenDto } from '../../dtos/search-checkup-children.dto';
import {
  CheckupChildrenAdminService,
  CheckupChildrenService,
} from '../../services';
import { AdminDecorator } from '@/app/auth/decorators';
import { Admin } from '@prisma/client';
import { Response } from 'express';
import { CheckupChildrenRepository } from '../../repositories';

@ApiTags('[ADMIN] Checkup Children')
@ApiSecurity('JWT')
@UseGuards(AdminGuard)
@RoleAllowed(AdminRole.SUPER_ADMIN, AdminRole.KADER)
@Controller({
  path: 'admin/checkup-children',
  version: '1',
})
export class CheckupChildrenAdminHttpController {
  constructor(
    private readonly checkupChildrenAdminService: CheckupChildrenAdminService,
  ) {}

  @Post()
  public async create(
    @Body() createCheckupChildrenDto: CreateCheckupChildrenDto,
    @AdminDecorator() admin: Admin,
  ) {
    try {
      const data = await this.checkupChildrenAdminService.create(
        createCheckupChildrenDto,
        admin,
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
  public async index(@Query() paginateDto: SearchCheckupChildrenDto) {
    try {
      const data = await this.checkupChildrenAdminService.paginate(paginateDto);

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
      const data = await this.checkupChildrenAdminService.detail(id);

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
      const data = await this.checkupChildrenAdminService.destroy(id);
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
    @AdminDecorator() admin: Admin,
    @Body() updateCheckupChildrenDto: UpdateCheckupChildrenDto,
  ) {
    try {
      const data = await this.checkupChildrenAdminService.update(
        id,
        admin,
        updateCheckupChildrenDto,
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

  @Get('export')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=checkup_children.xlsx')
  public async exportExcel(
    @Query() filterDto: SearchCheckupChildrenDto,
    @Res() res: Response,
  ) {
    try {
      const buffer =
        await this.checkupChildrenAdminService.exportExcel(filterDto);
      res.setHeader('Content-Length', Buffer.byteLength(buffer).toString());
      res.end(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

@ApiTags('[USER] Checkup Children')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/checkup-children',
  version: '1',
})
export class CheckupChildrenHttpController {
  constructor(
    private readonly checkupChildrenService: CheckupChildrenService,
    private readonly checkupChildrenRepository: CheckupChildrenRepository,
  ) {}

  @Get()
  public async index(
    @Query() paginateDto: SearchCheckupChildrenDto,
    @Query('childId') childrenId: string,
  ) {
    try {
      const data = await this.checkupChildrenService.paginate(
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

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.checkupChildrenService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('export')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=checkup_children.xlsx')
  public async exportExcel(
    @Query('childrenId') childrenId: string,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.checkupChildrenService.exportExcel(childrenId);
      res.setHeader('Content-Length', Buffer.byteLength(buffer).toString());
      res.end(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('bmi-chart')
  async getBMIChart(
    @Query('childId') childId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const data = await this.checkupChildrenRepository.getBMIChartData(
      childId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return new ResponseEntity({
      data,
      status: HttpStatus.OK,
      message: 'Data fetched successfully',
    });
  }
}
