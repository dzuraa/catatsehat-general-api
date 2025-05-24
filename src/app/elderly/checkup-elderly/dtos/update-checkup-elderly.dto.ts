import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckupElderlyDto } from './create-checkup-elderly.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateCheckupElderlyDto extends PartialType(
  CreateCheckupElderlyDto,
) {
  @ApiProperty()
  @IsString()
  name: string;

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
  dateTime: string;
}
