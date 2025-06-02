import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
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

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^data:application\/pdf;base64,/, {
    message: 'Only PDF files are allowed',
  })
  fileDiagnosed?: string;
}
