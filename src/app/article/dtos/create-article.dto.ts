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

  @ApiPropertyOptional({
    example:
      'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
