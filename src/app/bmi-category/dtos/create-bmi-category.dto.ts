import { ApiProperty } from '@nestjs/swagger';
import { BMIStatus, Gender } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateBmiCategoryDto {
  @ApiProperty({
    enum: Gender,
    example: 'MALE, FEMALE',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  minAge: number;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  maxAge: number;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  minBMI: number;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  maxBMI: number;

  @ApiProperty({
    enum: BMIStatus,
    example: 'MALNUTRITION, UNDERNUTRITION, NORMAL, OVERWEIGHT, OBESITY',
  })
  @IsEnum(BMIStatus)
  status: BMIStatus;
}
