import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetLungsDto extends PaginationQueryDto {
  @ApiProperty({
    required: false,
  })
  date: string;
}
