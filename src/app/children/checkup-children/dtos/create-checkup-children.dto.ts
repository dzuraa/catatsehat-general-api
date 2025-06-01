import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCheckupChildrenDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'childId cannot be empty',
  })
  @IsString({
    message: 'childId must be a string',
  })
  childrenId: string;

  @ApiProperty({
    example: '2022-07-25T14:30:00.000Z',
  })
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.date', { lang: 'id' }),
    },
  )
  dateTime: string;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number', { lang: 'id' }),
    },
  )
  height: number;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number', { lang: 'id' }),
    },
  )
  weight: number;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number', { lang: 'id' }),
    },
  )
  headCircumference: number;

  @ApiProperty({
    example: 'MALE/FEMALE',
  })
  @IsEnum(Gender, {
    message: i18nValidationMessage('validation.enum'),
  })
  gender: `${Gender}`;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^data:application\/pdf;base64,/, {
    message: 'Only PDF files are allowed',
  })
  fileDiagnosed?: string;
}
