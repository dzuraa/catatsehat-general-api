import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProvinceFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
