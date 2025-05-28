import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  // IsNumber,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMasterElderlyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'MALE/FEMALE',
  })
  @IsEnum(Gender)
  gender: `${Gender}`;

  @ApiProperty({
    example: '2024-10-07T04:23:04Z',
  })
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.date', { lang: 'id' }),
    },
  )
  dateOfBirth: string;

  @ApiProperty()
  @IsString()
  placeOfBirth: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiProperty()
  @IsString()
  address: string;

  // @ApiPropertyOptional({
  //   type: 'string',
  //   format: 'binary',
  // })
  // @IsOptional()
  // @IsString()
  // elderlyPicture?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  fileElderlyIdentity?: string;
}
