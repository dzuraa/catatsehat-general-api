import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCheckupMothersAdminDto {
  @ApiProperty()
  @IsString()
  healthPostId: string;

  @ApiProperty()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number'),
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
      message: i18nValidationMessage('validation.number'),
    },
  )
  upperArmCircumference: number;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.number'),
    },
  )
  fundusMeasurement: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^data:application\/pdf;base64,/, {
    message: 'Only PDF files are allowed',
  })
  fileDiagnosed?: string;

  @ApiProperty()
  @IsString()
  motherId: string;
}
