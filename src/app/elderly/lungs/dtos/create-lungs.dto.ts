import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class CreateLungsDto {
  @ApiProperty()
  @IsString()
  elderlyId: string;

  @ApiProperty()
  @IsArray()
  responses: {
    id: string;
    value: number;
  }[];

  @ApiProperty()
  @IsInt()
  score: number;

  @ApiProperty()
  @IsString()
  conclusionId: string;
}
