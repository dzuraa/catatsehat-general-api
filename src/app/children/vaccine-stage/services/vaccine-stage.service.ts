import { Injectable } from '@nestjs/common';
import { Filter, VaccineStageRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class VaccineStageService {
  constructor(
    private readonly vaccineStageRepository: VaccineStageRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.vaccineStageRepository.paginate(paginateDto);
  }

  public find(filter: Filter) {
    return this.vaccineStageRepository.find(filter);
  }

  public detail(id: string) {
    try {
      return this.vaccineStageRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
