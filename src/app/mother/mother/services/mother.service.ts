import { alphaNumeric, randomNumber } from '@/common/functions/crypto.function';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ENV } from 'src/config/env';
import { CreateMotherDto, UpdateMotherDto } from '../dtos';
import { MotherRepository } from '../repositories';
import { PostPartumSeederService } from './postpartum-seeder.service';

@Injectable()
export class MotherService {
  constructor(
    private readonly motherRepository: MotherRepository,
    private readonly postPartumSeederService: PostPartumSeederService,
  ) {}

  private generateMotherAccessUrl(motherCode: string): string {
    const baseUrl = ENV.FRONTEND_BASE_URL;
    return `${baseUrl}/public/option-mother?code=${motherCode}`;
  }

  public paginate(paginateDto: PaginationQueryDto, user: User) {
    const whereCondition: Prisma.MotherWhereInput = {
      deletedAt: null,
      userId: user.id,
    };

    return this.motherRepository.paginate(paginateDto, {
      where: whereCondition,
    });
  }

  public paginateAdmin(paginateDto: PaginationQueryDto) {
    const whereCondition: Prisma.MotherWhereInput = {
      deletedAt: null,
    };

    return this.motherRepository.paginate(paginateDto, {
      where: whereCondition,
    });
  }

  public async detail(id: string) {
    const code = await this.motherRepository.update(
      {
        id,
        deletedAt: null,
      },
      {
        code: alphaNumeric(64),
      },
    );

    const mother = await this.motherRepository.firstOrThrow({
      id,
      code: code.code as string,
      deletedAt: null,
    });

    // Dynamically generate URL
    const url = this.generateMotherAccessUrl(mother.code as string);

    // Return the mother data along with the generated URL
    return {
      ...mother,
      url,
    };
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

  public async refreshCode(MotherId: string) {
    const child = await this.motherRepository.firstOrThrow({
      id: MotherId,
      deletedAt: null,
    });

    if (!child) {
      throw new Error('Child not found');
    }

    const updatedCode = await this.motherRepository.update(
      {
        id: MotherId,
      },
      {
        code: alphaNumeric(64),
      },
    );

    const url = this.generateMotherAccessUrl(updatedCode.code as string);

    return {
      ...updatedCode,
      url,
    };
  }
}
