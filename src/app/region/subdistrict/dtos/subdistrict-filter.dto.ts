import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SubDistrictFilterDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  districtId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
