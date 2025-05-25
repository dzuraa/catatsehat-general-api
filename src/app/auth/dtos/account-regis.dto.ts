import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountRegistrationDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'placeOfBirth cannot be empty',
  })
  @IsString({
    message: 'placeOfBirth must be a string',
  })
  placeOfBirth: string;

  @ApiProperty({
    example: '2024-10-07T04:23:04Z',
  })
  @IsNotEmpty({
    message: 'placeOfBirth cannot be empty',
  })
  @IsDateString(
    {},
    {
      message: 'dateOfBirth must be a valid date string',
    },
  )
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'address cannot be empty',
  })
  @IsString({
    message: 'address must be a string',
  })
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'subDistrictId must be a string',
  })
  subDistrictId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'userPicture must be a string',
  })
  userPicture?: string;
}
