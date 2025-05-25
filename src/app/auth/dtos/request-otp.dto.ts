import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class RequestOtpDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'phone must not be empty',
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
}
