import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { IsOptional, IsDateString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SearchCheckupElderlyDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by checkup date (yyyy-MM-dd)',
    example: '2025-03-20',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.date'),
    },
  )
  date?: string;
}
