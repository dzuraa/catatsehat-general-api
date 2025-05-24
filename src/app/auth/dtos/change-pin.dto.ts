import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Match } from '../decorators';

export class ChangePinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currentPin: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, {
    message: 'err.pin_length',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.notEmpty'),
  })
  newPin: string;

  @ApiProperty()
  @IsString()
  @Match('newPin', {
    message: 'err.pin_not_match',
  })
  confirmNewPin: string;
}
