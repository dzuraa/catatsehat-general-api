import { AuthGuard } from '@/app/auth';
import { UserDecorator } from '@/app/auth/decorators';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateCheckupMothersPublicDto } from 'src/app/mother/checkup-mother/dtos';
import { CheckupMothersPublicService } from 'src/app/mother/checkup-mother/services';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CheckupMotherSearchDto } from '../../dtos/search-checkup-mother.dto';
import { CheckupMotherRepository } from '../../repositories';

@ApiTags('CheckupMotherPublic')
@Controller({
  path: 'public/checkupMother',
  version: '1',
})
export class CheckupMotherPublicHttpController {
  constructor(
    private readonly checkupMotherAdminService: CheckupMothersPublicService,
  ) {}

  @Post()
  public async create(
    @Body() createCheckupMotherAdminDto: CreateCheckupMothersPublicDto,
  ) {
    try {
      const data = await this.checkupMotherAdminService.create(
        createCheckupMotherAdminDto,
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
}

@ApiTags('[USER] Checkup Mothers')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'user/checkupmother',
  version: '1',
})
export class CheckupMothersHttpController {
  constructor(
    private readonly checkupmotherService: CheckupMothersPublicService,
    private readonly checkupMothersRepository: CheckupMotherRepository,
  ) {}

  @Get()
  public async index(
    @Query() paginateDto: CheckupMotherSearchDto,
    @Query('motherId') motherId: string,
  ) {
    try {
      const data = await this.checkupmotherService.paginate(
        paginateDto,
        motherId,
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

  @Get('bmi-chart')
  async getBMIChart(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @UserDecorator() user: User,
  ) {
    try {
      console.log(startDate, endDate);
      const data = await this.checkupMothersRepository.getBMIChartData(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        user.id,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/detail')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.checkupmotherService.detail(id);

      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // @Get('history')
  // @UseGuards(AuthGuard)
  // async getHistory(
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('startDate') startDate?: string,
  //   @Query('endDate') endDate?: string
  // ) {
  //   return this.checkupService.getCheckupHistory({
  //     page,
  //     limit,
  //     startDate: startDate ? new Date(startDate) : undefined,
  //     endDate: endDate ? new Date(endDate) : undefined
  //   });
  // }

  // @Get('bmi-graphics')
  // async getBmiHistory(
  //   @Query('userId') userId: string,
  //   @Query('startDate') startDate: string,
  //   @Query('endDate') endDate: string,
  // ) {
  //   const bmiGraphics = await this.checkupMothersRepository.findAll({
  //     where: {
  //       ownerId: userId,
  //       dateTime: {
  //         gte: new Date(startDate),
  //         lte: new Date(endDate),
  //       },
  //     },
  //     select: {
  //       dateTime: true,
  //       bmi: true,
  //     },
  //     orderBy: {
  //       dateTime: 'asc',
  //     },
  //   });
  //   return new ResponseEntity({
  //     data: bmiGraphics,
  //     status: HttpStatus.OK,
  //     message: 'Data fetched successfully',
  //   });
  // }
}
