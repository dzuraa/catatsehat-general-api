import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorators/match-constraint.decorator';

export class ResetPinDto {
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
    message: 'confirmPin cannot be empty',
  })
  @IsString({
    message: 'confirmPin must be a string',
  })
  @Length(6, 6, {
    message: 'confirmPin must be 6 digits',
  })
  @Match('newPin', {
    message: 'confirmPin does not match newPin',
  })
  confirmPin: string;
}
