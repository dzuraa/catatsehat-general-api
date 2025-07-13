import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class SearchPregnancyMonitoringRecordDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  weekPregnancyMonitoringId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  trimesterId?: string;
}
