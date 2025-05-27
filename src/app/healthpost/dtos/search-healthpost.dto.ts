import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchHealthPostDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
