import { Injectable } from '@nestjs/common';
import { TrimesterRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class TrimesterService {
  constructor(private readonly trimesterRepository: TrimesterRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.trimesterRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.trimesterRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
