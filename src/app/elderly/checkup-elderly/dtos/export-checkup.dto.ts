import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ExportCheckupDto {
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
