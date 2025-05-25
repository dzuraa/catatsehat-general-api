import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorators/match-constraint.decorator';

export class ResetPassDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'phone cannot be empty',
  })
  @IsNumberString(
    {},
    {
      message: 'phone must be a number string',
    },
  )
  @IsPhoneNumber('ID', {
    message: 'phone must be a valid Indonesian phone number',
  })
  @Length(10, 15, {
    message: 'phone must be between 10 and 15 characters',
  })
  phone: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'otp cannot be empty',
  })
  @IsString({
    message: 'otp must be a string',
  })
  otp: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'newPassword cannot be empty',
  })
  @IsString({
    message: 'newPassword must be a string',
  })
  @IsStrongPassword(
    {},
    {
      message:
        'newPassword must be strong, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    },
  )
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'confirmPassword cannot be empty',
  })
  @IsString({
    message: 'confirmPassword must be a string',
  })
  @Match('newPassword', {
    message: 'confirmPassword does not match newPassword',
  })
  confirmPassword: string;
}
