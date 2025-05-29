import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMotherDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.date', { lang: 'id' }),
    },
  )
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  placeOfBirth: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  subDistrictId: string;
}
