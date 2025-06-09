import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Filter, WeekPregnancyMonitoringRepository } from '../repositories';

@Injectable()
export class WeekPregnancyMonitoringService {
  constructor(
    private readonly weekPregnancyMonitoringRepository: WeekPregnancyMonitoringRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.weekPregnancyMonitoringRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.weekPregnancyMonitoringRepository.find({
      ...filter,
      orderBy: {
        weekNumber: 'asc',
      },
    });
  }

  public detail(id: string) {
    try {
      return this.weekPregnancyMonitoringRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
