import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RegencyFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  provinceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
