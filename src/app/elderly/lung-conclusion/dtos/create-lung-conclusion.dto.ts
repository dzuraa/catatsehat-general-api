import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateLungConclusionDto {
  @ApiProperty({
    format: 'int32',
    example: 6,
  })
  @IsInt()
  value: number;

  @ApiProperty()
  @IsString()
  conclusion: string;

  @ApiProperty()
  @IsString()
  description: string;
}
