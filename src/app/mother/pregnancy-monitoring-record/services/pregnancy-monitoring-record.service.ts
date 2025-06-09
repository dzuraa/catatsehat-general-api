import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PregnancyMonitoringRecordRepository } from '../repositories';

@Injectable()
export class PregnancyMonitoringRecordService {
  constructor(
    private readonly pregnancyMonitoringRecordRepository: PregnancyMonitoringRecordRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.pregnancyMonitoringRecordRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.pregnancyMonitoringRecordRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
