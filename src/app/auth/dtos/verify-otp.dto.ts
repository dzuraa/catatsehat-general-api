import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyOtpDto {
  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  otp: string;
}
