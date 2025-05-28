import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChildrenDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'name cannot be empty',
  })
  @IsString({
    message: 'name must be a string',
  })
  name: string;

  @ApiProperty({
    example: '2024-10-07T04:23:04Z',
  })
  @IsNotEmpty({
    message: 'dateOfBirth cannot be empty',
  })
  @IsDateString(
    {},
    {
      message: 'dateOfBirth must be a valid date string in ISO format',
    },
  )
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'placeOfBirth cannot be empty',
  })
  @IsString({
    message: 'placeOfBirth must be a string',
  })
  placeOfBirth: string;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: 'childOrder must be a number',
    },
  )
  childOrder: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'bloodType must be a string',
  })
  bloodType?: string;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: 'height must be a number',
    },
  )
  height: number;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: 'weight must be a number',
    },
  )
  weight: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'address cannot be empty',
  })
  @IsString({
    message: 'address must be a string',
  })
  address: string;

  @ApiProperty({
    example: 'MALE/FEMALE',
  })
  @IsEnum(Gender)
  gender: `${Gender}`;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  childPicture?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  birthCertificate?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  kiaCard?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  familyCardId?: string;
}
