import { Injectable } from '@nestjs/common';
import { Filter, VaccineRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class VaccineService {
  constructor(private readonly vaccineRepository: VaccineRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.vaccineRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.vaccineRepository.find(filter);
  }

  public detail(id: string) {
    try {
      return this.vaccineRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
