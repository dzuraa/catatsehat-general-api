import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateImmunizationOptionalRecordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  childrenId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  dateGiven: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note: string;
}
