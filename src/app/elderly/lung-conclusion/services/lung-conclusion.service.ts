import { Injectable } from '@nestjs/common';
import { LungConclusionRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateLungConclusionDto, UpdateLungConclusionDto } from '../dtos';

@Injectable()
export class LungConclusionService {
  constructor(
    private readonly lungsConclutionRepository: LungConclusionRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.lungsConclutionRepository.paginate(paginateDto, {
      where: {
        OR: [
          {
            conclusion: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
        ],
        deletedAt: null,
      },
    });
  }

  public detail(id: string) {
    try {
      return this.lungsConclutionRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.lungsConclutionRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createLungConclusionDto: CreateLungConclusionDto) {
    try {
      return this.lungsConclutionRepository.create(createLungConclusionDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(
    id: string,
    updateLungConclusionDto: UpdateLungConclusionDto,
  ) {
    try {
      return this.lungsConclutionRepository.update(
        { id },
        updateLungConclusionDto,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
