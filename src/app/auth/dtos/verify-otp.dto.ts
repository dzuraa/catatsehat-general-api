import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'otp cannot be empty',
  })
  @IsString({
    message: 'otp must be a string',
  })
  otp: string;
}
