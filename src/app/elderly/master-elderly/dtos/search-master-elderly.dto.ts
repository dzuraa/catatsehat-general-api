import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { IsOptional } from 'class-validator';

export class SearchMasterElderlyDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
