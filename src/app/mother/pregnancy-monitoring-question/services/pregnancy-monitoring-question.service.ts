import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Filter, PregnancyMonitoringQuestionRepository } from '../repositories';

@Injectable()
export class PregnancyMonitoringQuestionService {
  constructor(
    private readonly pregnancyMonitoringQuestionRepository: PregnancyMonitoringQuestionRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.pregnancyMonitoringQuestionRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.pregnancyMonitoringQuestionRepository.find({
      ...filter,
      orderBy: {
        questionNumber: 'asc',
      },
    });
  }

  public detail(id: string) {
    try {
      return this.pregnancyMonitoringQuestionRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
