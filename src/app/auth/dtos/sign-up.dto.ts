import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Match } from '../decorators/match-constraint.decorator';

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'name cannot be empty',
  })
  @IsString({
    message: 'name must be a string',
  })
  name: string;

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
    message: 'pin cannot be empty',
  })
  @IsString({
    message: 'pin must be a string',
  })
  @Length(6, 6, {
    message: 'pin must be 6 digits',
  })
  pin: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'confirmPin cannot be empty',
  })
  @IsString({
    message: 'confirmPin must be a string',
  })
  @Match('pin', {
    message: 'confirmPin does not match pin',
  })
  confirmPin: string;
}
