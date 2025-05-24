import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
export class SignInAdminDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.email'),
    },
  )
  @IsString()
  email: string;

  @ApiProperty()
  @IsStrongPassword(
    {},
    {
      message: i18nValidationMessage('validation.strongPassword'),
    },
  )
  @IsNotEmpty()
  @IsString()
  password: string;
}
