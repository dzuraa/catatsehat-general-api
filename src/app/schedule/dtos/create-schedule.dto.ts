import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsISO8601, IsString, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'healthPostId cannot be empty',
  })
  @IsString({
    message: 'healthPostId must be a string',
  })
  healthPostId: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'staffId cannot be empty',
  })
  @IsString({
    message: 'staffId must be a string',
  })
  staffId: string;

  @ApiProperty({
    example: '2025-12-01T08:00:00.000Z',
  })
  @IsNotEmpty({
    message: 'startAt cannot be empty',
  })
  @IsISO8601(
    {},
    {
      message: 'startAt must be a valid ISO 8601 datetime string',
    },
  )
  startAt: string;

  @ApiProperty({
    example: '2025-12-01T10:00:00.000Z',
  })
  @IsNotEmpty({
    message: 'endAt cannot be empty',
  })
  @IsISO8601(
    {},
    {
      message: 'endAt must be a valid ISO 8601 datetime string',
    },
  )
  endAt: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'address cannot be empty',
  })
  @IsString({
    message: 'address must be a string',
  })
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'note must be a string',
  })
  note?: string;
}
