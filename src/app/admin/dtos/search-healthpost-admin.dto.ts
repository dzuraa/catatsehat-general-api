import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class HealthPostAdminSearchDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  healthPostId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
