import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMasterDataLungsDto {
  @ApiProperty({
    description: 'Question',
    example: 'Pertanyaan',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Question',
    example: 'Pertanyaan',
  })
  @IsString()
  description: string;
}
