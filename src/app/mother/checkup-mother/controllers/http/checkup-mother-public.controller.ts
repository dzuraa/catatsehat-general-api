import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCheckupMothersPublicDto } from 'src/app/mother/checkup-mother/dtos';
import { CheckupMothersPublicService } from 'src/app/mother/checkup-mother/services';
import { ResponseEntity } from 'src/common/entities/response.entity';

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
