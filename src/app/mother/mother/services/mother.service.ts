import { randomNumber } from '@/common/functions/crypto.function';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateMotherDto, UpdateMotherDto } from '../dtos';
import { MotherRepository } from '../repositories';
import { PostPartumSeederService } from './postpartum-seeder.service';

@Injectable()
export class MotherService {
  constructor(
    private readonly motherRepository: MotherRepository,
    private readonly postPartumSeederService: PostPartumSeederService,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.motherRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.motherRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.motherRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createMotherDto: CreateMotherDto, user: User) {
    const data: Prisma.MotherCreateInput = {
      name: createMotherDto.name,
      dateOfBirth: createMotherDto.dateOfBirth,
      placeOfBirth: createMotherDto.placeOfBirth,
      address: createMotherDto.address,
      user: { connect: { id: user.id } },
      subDistrict: { connect: { id: createMotherDto.subDistrictId } },
    };
    // generate random code
    const code = randomNumber(12);

    // check if code already used
    const mother = await this.motherRepository.first({
      code: code,
    });
    if (mother) {
      Object.assign(data, {
        code: randomNumber(12),
      });
    }
    if (mother == null) {
      Object.assign(data, {
        code: code,
      });
    }

    const createdMother = await this.motherRepository.create(data);

    const postPartumCheckupSeed =
      await this.postPartumSeederService.seedPostPartumRecords(
        createdMother.id,
      );

    return {
      mother: createdMother,
      postPartumCheckupSeed,
    };
  }

  public async update(id: string, updateMotherDto: UpdateMotherDto) {
    try {
      return this.motherRepository.update({ id }, updateMotherDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public detailByCode(code: string) {
    try {
      return this.motherRepository.firstOrThrow({
        code,
        deletedAt: null,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
