import { Injectable } from '@nestjs/common';
import { BmiCategoryRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateBmiCategoryDto, UpdateBmiCategoryDto } from '../dtos';

@Injectable()
export class BmiCategoryService {
  constructor(private readonly bMICategoryRepository: BmiCategoryRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.bMICategoryRepository.paginate(paginateDto, {
      where: {
        deletedAt: null,
      },
    });
  }

  public detail(id: string) {
    try {
      return this.bMICategoryRepository.firstOrThrow({
        id,
        deletedAt: null,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.bMICategoryRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createBmiCategoryDto: CreateBmiCategoryDto) {
    try {
      return this.bMICategoryRepository.create(createBmiCategoryDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateBmiCategoryDto: UpdateBmiCategoryDto) {
    try {
      return this.bMICategoryRepository.update({ id }, updateBmiCategoryDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
