import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsStrongPassword,
  IsPhoneNumber,
  IsNumberString,
  Length,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AdminType } from '@prisma/client';

export class CreateAdminDto {
  @ApiProperty({
    example: 'name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'email',
  })
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.email'),
    },
  )
  email: string;

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
    message: i18nValidationMessage('validation.length', { min: 10, max: 15 }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.notEmpty'),
  })
  phone: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsStrongPassword(
    {},
    {
      message: i18nValidationMessage('validation.strongPassword'),
    },
  )
  password: string;

  @ApiProperty({
    example: 'SUOER_ADMIN / KADER',
  })
  @IsEnum(AdminType)
  type: `${AdminType}`;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  healthPostId?: string;
}
