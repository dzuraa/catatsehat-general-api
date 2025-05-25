import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorators';

export class ChangePinDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'currentPin cannot be empty',
  })
  @IsString({
    message: 'currentPin must be a string',
  })
  currentPin: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'newPin cannot be empty',
  })
  @IsString({
    message: 'newPin must be a string',
  })
  @Length(6, 6, {
    message: 'newPin must be 6 digits',
  })
  newPin: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'confirmNewPin cannot be empty',
  })
  @IsString({
    message: 'confirmNewPin must be a string',
  })
  @Match('newPin', {
    message: 'confirmNewPin does not match newPin',
  })
  confirmNewPin: string;
}
