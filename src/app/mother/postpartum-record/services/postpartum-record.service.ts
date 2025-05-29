import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PostpartumRecordRepository } from '../repositories';

@Injectable()
export class PostpartumRecordService {
  constructor(
    private readonly postPartumRecordRepository: PostpartumRecordRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.postPartumRecordRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.postPartumRecordRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
