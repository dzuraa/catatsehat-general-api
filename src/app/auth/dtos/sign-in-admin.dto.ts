import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignInAdminDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsNotEmpty({
    message: 'email cannot be empty',
  })
  @IsEmail(
    {},
    {
      message: 'email must be a valid email address',
    },
  )
  @IsString({
    message: 'email must be a string',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'password cannot be empty',
  })
  @IsStrongPassword(
    {},
    {
      message:
        'password must be strong, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    },
  )
  @IsString({
    message: 'password must be a string',
  })
  password: string;
}
