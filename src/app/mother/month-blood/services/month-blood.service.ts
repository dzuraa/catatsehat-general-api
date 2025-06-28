import { Injectable } from '@nestjs/common';
import { Filter, MonthBloodRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class MonthBloodService {
  constructor(private readonly monthBloodRepository: MonthBloodRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.monthBloodRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.monthBloodRepository.find(filter);
  }

  public detail(id: string) {
    try {
      return this.monthBloodRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
