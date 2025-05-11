import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountRegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.notEmpty'),
  })
  placeOfBirth: string;

  @ApiProperty({
    example: '2024-10-07T04:23:04Z',
  })
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.date'),
    },
  )
  dateOfBirth: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.notEmpty'),
  })
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  subDistrictId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userPicture?: string;
}
