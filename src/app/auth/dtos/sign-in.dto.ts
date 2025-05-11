import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInDto {
  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  @IsNumberString(
    {},
    {
      message: i18nValidationMessage('validation.numberString'),
    },
  )
  @IsPhoneNumber('ID', {
    message: i18nValidationMessage('validation.phoneNumber'),
  })
  @Length(10, 15, {
    message: i18nValidationMessage('validation.length', { min: 8, max: 13 }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.notEmpty'),
  })
  phone: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, {
    message: 'err.pin_length',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.notEmpty'),
  })
  pin: string;
}
