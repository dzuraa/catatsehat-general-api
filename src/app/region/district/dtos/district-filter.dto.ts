import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DistrictFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  regencyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
