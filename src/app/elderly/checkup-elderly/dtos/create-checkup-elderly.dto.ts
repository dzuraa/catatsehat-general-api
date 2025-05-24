import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { BMIStatus, CheckupStatus } from '@prisma/client';

export class CreateCheckupElderlyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  healthPostId: string;

  @ApiProperty({
    example: '2022-07-25T14:30:00.000Z',
  })
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.date'),
    },
  )
  @IsString()
  attend: string;

  @ApiProperty()
  @IsString()
  adminId: string;

  @ApiProperty()
  @IsNumber()
  month: number;

  @ApiProperty({
    description: 'Height in centimeters',
    example: 170.5,
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number'),
    },
  )
  height: number;

  @ApiProperty({
    description: 'Weight in kilograms',
    example: 65.5,
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number', { lang: 'id' }),
    },
  )
  weight: number;

  @ApiProperty({
    description: 'Body Mass Index',
    example: 22.5,
  })
  @IsNumber()
  bmi: number;

  @ApiProperty({
    description: 'Blood tension measurement',
    example: 120.0,
  })
  @IsNumber()
  bloodTension: number;

  @ApiProperty({
    description: 'Blood sugar level',
    example: 100.0,
  })
  @IsNumber()
  bloodSugar: number;

  @ApiPropertyOptional({
    enum: BMIStatus,
    description: 'BMI Status category',
    example: BMIStatus.NORMAL,
  })
  @IsOptional()
  @IsEnum(BMIStatus)
  bmiStatus?: BMIStatus;

  @ApiProperty({
    enum: CheckupStatus,
    default: CheckupStatus.UNVERIFIED,
    description: 'Checkup verification status',
  })
  @IsEnum(CheckupStatus)
  status: CheckupStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^data:application\/pdf;base64,/, {
    message: 'Only PDF files are allowed',
  })
  fileDiagnosed?: string;

  @ApiProperty()
  @IsString()
  elderlyId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lungsConclutionId?: string;
}
