import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

import { Filter, PostpartumQuestionRepository } from '../repositories';

@Injectable()
export class PostpartumQuestionService {
  constructor(
    private readonly postPartumQuestionRepository: PostpartumQuestionRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.postPartumQuestionRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.postPartumQuestionRepository.find({
      ...filter,
      orderBy: {
        questionNumber: 'asc',
      },
    });
  }

  public detail(id: string) {
    try {
      return this.postPartumQuestionRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
