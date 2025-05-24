import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  newsMaker: string;

  @ApiProperty({
    example: 'content',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filePicture?: string;
}
