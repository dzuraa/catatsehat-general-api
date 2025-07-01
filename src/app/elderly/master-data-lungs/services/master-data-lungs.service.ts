import { Injectable } from '@nestjs/common';
import { MasterDataLungsRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateMasterDataLungsDto, UpdateMasterDataLungsDto } from '../dtos';

@Injectable()
export class MasterDataLungsService {
  constructor(
    private readonly masterDataLungsRepository: MasterDataLungsRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.masterDataLungsRepository.paginate(paginateDto, {
      where: {
        OR: [
          {
            question: {
              contains: paginateDto.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
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
      return this.masterDataLungsRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.masterDataLungsRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createMasterDataLungsDto: CreateMasterDataLungsDto) {
    try {
      return this.masterDataLungsRepository.create(createMasterDataLungsDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(
    id: string,
    updateMasterDataLungsDto: UpdateMasterDataLungsDto,
  ) {
    try {
      return this.masterDataLungsRepository.update(
        { id },
        updateMasterDataLungsDto,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
