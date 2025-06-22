import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBloodRecordDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'motherId cannot be empty',
  })
  @IsString({
    message: 'motherId must be a string',
  })
  motherId: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'monthId cannot be empty',
  })
  @IsString({
    message: 'monthId must be a string',
  })
  monthId: string;

  @ApiProperty({
    example: '2025-12-01T10:00:00.000Z',
  })
  @IsNotEmpty({
    message: 'date cannot be empty',
  })
  @IsISO8601(
    {},
    {
      message: 'date must be a valid ISO 8601 datetime string',
    },
  )
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffJob?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
