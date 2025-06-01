import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'reporter cannot be empty',
  })
  @IsString({
    message: 'reporter must be a string',
  })
  reporter: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'phoneNumber cannot be empty',
  })
  @IsNumberString(
    {},
    {
      message: 'phoneNumber must be a number string',
    },
  )
  @IsPhoneNumber('ID', {
    message: 'phoneNumber must be a valid Indonesian phone number',
  })
  @Length(10, 15, {
    message: 'phoneNumber must be between 10 and 15 characters',
  })
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'childName cannot be empty',
  })
  @IsString({
    message: 'childName must be a string',
  })
  childName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'observation cannot be empty',
  })
  @IsString({
    message: 'observation must be a string',
  })
  observation: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'childAddress cannot be empty',
  })
  @IsString({
    message: 'childAddress must be a string',
  })
  childAddress: string;

  @ApiProperty({
    example: 'MALE/FEMALE',
  })
  @IsEnum(Gender, {
    message: 'gender must be MALE or FEMALE',
  })
  gender: `${Gender}`;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'fileChildPicture must be a string',
  })
  fileChildPicture?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'fileHousePicture must be a string',
  })
  fileHousePicture?: string;
}
