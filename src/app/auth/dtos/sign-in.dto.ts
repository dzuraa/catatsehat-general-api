import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class SignInDto {
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
}
