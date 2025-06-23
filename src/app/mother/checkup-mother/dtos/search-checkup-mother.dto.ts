import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, Matches } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class CheckupMotherSearchDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by month from createdAt with format YYYY-MM',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in YYYY-MM format' })
  month?: string;

  @ApiPropertyOptional({ description: 'Filter by createdAt date' })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
