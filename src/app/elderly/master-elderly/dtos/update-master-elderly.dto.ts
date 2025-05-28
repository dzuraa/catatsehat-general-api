import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterElderlyDto } from './create-master-elderly.dto';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { Gender } from '@prisma/client';
// import {
// IsString,
// IsOptional,
// IsDateString,
// IsEnum,
// IsNumber,
// } from 'class-validator';
// import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateMasterElderlyDto extends PartialType(
  CreateMasterElderlyDto,
) {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // name?: string;
  // @ApiPropertyOptional({
  //   example: 'MALE/FEMALE',
  // })
  // @IsOptional()
  // @IsEnum(Gender)
  // gender?: `${Gender}`;
  // @ApiPropertyOptional({
  //   example: '2024-10-07T04:23:04Z',
  // })
  // @IsOptional()
  // @IsDateString(
  //   {},
  //   {
  //     message: i18nValidationMessage('validation.date', { lang: 'id' }),
  //   },
  // )
  // dateOfBirth?: string;
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // placeOfBirth?: string;
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // bloodType?: string;
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // address?: string;
}
