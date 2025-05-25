import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class AdminSearchDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
