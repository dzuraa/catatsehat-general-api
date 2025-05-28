import { Injectable } from '@nestjs/common';
import { MasterElderlyRepository } from '../repositories';
import { CreateMasterElderlyDto, UpdateMasterElderlyDto } from '../dtos';
import { SearchMasterElderlyDto } from '../dtos/search-master-elderly.dto';
import { Prisma, User } from '@prisma/client';
// import { omit } from 'lodash';
import { DateTime } from 'luxon';
// import { alphaNumeric } from '@/common/functions/crypto.function';
// import { env } from 'process';

@Injectable()
export class MasterElderlyService {
  constructor(
    private readonly elderlyRepository: MasterElderlyRepository,
    // private readonly fileService: FileService,
  ) {}

  public paginate(paginateDto: SearchMasterElderlyDto, user?: User) {
    const whereCondition: Prisma.ElderlyWhereInput = {
      userId: user?.id,
      deletedAt: null,
    };

    // OR condition only if there is a search parameter
    if (paginateDto.search) {
      whereCondition.OR = [
        {
          name: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          address: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.elderlyRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      // include: {
      //   elderlyPicture: true,
      //   fileElderlyIdentity: true,
      // },
    });
  }

  public count() {
    return this.elderlyRepository.count({
      where: {
        id: {},
      },
    });
  }

  public async detail(id: string) {
    const elderly = await this.elderlyRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      // {
      //   // elderlyPicture: true,
      //   fileElderlyIdentity: true,
      // },
    );

    return elderly;
  }

  public async destroy(id: string) {
    try {
      return this.elderlyRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(
    createMasterElderlyDto: CreateMasterElderlyDto,
    user: User,
  ) {
    try {
      const data: Partial<Prisma.ElderlyCreateInput> = {
        name: createMasterElderlyDto.name,
        gender: createMasterElderlyDto.gender,
        placeOfBirth: createMasterElderlyDto.placeOfBirth,
        bloodType: createMasterElderlyDto.bloodType,
        address: createMasterElderlyDto.address,
      };

      if (createMasterElderlyDto.dateOfBirth) {
        const age = Math.abs(
          DateTime.fromISO(createMasterElderlyDto.dateOfBirth).diffNow('years')
            .years || 0,
        );

        Object.assign(data, {
          dateOfBirth: createMasterElderlyDto.dateOfBirth,
          age: age,
        });
      }

      // Relation to user
      Object.assign(data, {
        user: { connect: { id: user.id } },
      });

      // if (createMasterElderlyDto.elderlyPicture) {
      //   const elderlyPicture = await this.fileService.upload({
      //     file: createMasterElderlyDto.elderlyPicture,
      //     fileName: createMasterElderlyDto.name,
      //   });

      //   Object.assign(data, {
      //     elderlyPicture: { connect: { id: elderlyPicture.id } },
      //   });
      // }

      // if (createMasterElderlyDto.fileElderlyIdentity) {
      //   const fileElderlyIdentity = await this.fileService.upload({
      //     file: createMasterElderlyDto.fileElderlyIdentity,
      //     fileName: createMasterElderlyDto.name,
      //   });

      //   Object.assign(data, {
      //     fileElderlyIdentity: { connect: { id: fileElderlyIdentity.id } },
      //   });
      // }

      const createdElderly = await this.elderlyRepository.create(
        data as Prisma.ElderlyCreateInput,
      );
      return createdElderly;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async update(
    id: string,
    updateMasterElderlyDto: UpdateMasterElderlyDto,
  ) {
    try {
      // Prepare data for fields not related to file uploads
      // const data: Prisma.ElderlyUpdateInput = omit(updateMasterElderlyDto, [
      //   'elderlyPicture',
      //   'fileElderlyIdentity',
      // ]);
      const data: Prisma.ElderlyUpdateInput = {};

      if (updateMasterElderlyDto.dateOfBirth) {
        const age = Math.abs(
          DateTime.fromISO(updateMasterElderlyDto.dateOfBirth).diffNow('years')
            .years || 0,
        );

        Object.assign(data, {
          age: age,
          dateOfBirth: updateMasterElderlyDto.dateOfBirth,
        });
      }

      // Add other fields if they exist in updateMasterElderlyDto
      if (updateMasterElderlyDto.name) {
        data.name = updateMasterElderlyDto.name;
      }
      if (updateMasterElderlyDto.gender) {
        data.gender = updateMasterElderlyDto.gender;
      }
      if (updateMasterElderlyDto.placeOfBirth) {
        data.placeOfBirth = updateMasterElderlyDto.placeOfBirth;
      }
      if (updateMasterElderlyDto.bloodType) {
        data.bloodType = updateMasterElderlyDto.bloodType;
      }
      if (updateMasterElderlyDto.address) {
        data.address = updateMasterElderlyDto.address;
      }

      // Handle file uploads and connections for each file field
      // if (updateMasterElderlyDto.elderlyPicture) {
      //   const fileElderlyPicture = await this.fileService.upload({
      //     file: updateMasterElderlyDto.elderlyPicture,
      //     fileName: updateMasterElderlyDto.name as string,
      //   });

      //   data.elderlyPicture = { connect: { id: fileElderlyPicture.id } };
      // }

      // if (updateMasterElderlyDto.fileElderlyIdentity) {
      //   const fileElderlyIdentity = await this.fileService.upload({
      //     file: updateMasterElderlyDto.fileElderlyIdentity,
      //     fileName: updateMasterElderlyDto.name as string,
      //   });

      //   data.fileElderlyIdentity = { connect: { id: fileElderlyIdentity.id } };
      // }

      // Update the elderly record with the prepared data
      return await this.elderlyRepository.update({ id }, data);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
