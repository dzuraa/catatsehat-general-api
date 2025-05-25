import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { IsOptional } from 'class-validator';

export class SearchArticleDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
