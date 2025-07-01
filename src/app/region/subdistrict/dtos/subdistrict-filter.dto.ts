import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SubDistrictFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  districtId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
