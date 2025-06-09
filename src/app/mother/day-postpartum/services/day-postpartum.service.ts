import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { DayPostpartumRepository, Filter } from '../repositories';

@Injectable()
export class DayPostPartumService {
  constructor(
    private readonly dayPostpartumRepository: DayPostpartumRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.dayPostpartumRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.dayPostpartumRepository.find({
      ...filter,
      orderBy: {
        dayNumber: 'asc',
      },
    });
  }

  public detail(id: string) {
    try {
      return this.dayPostpartumRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
