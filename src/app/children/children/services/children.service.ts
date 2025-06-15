import { Injectable } from '@nestjs/common';
import { ChildrenRepository } from '../repositories';
import { CreateChildrenDto, UpdateChildrenDto } from '../dtos';
import { FileService } from 'src/app/file/services/file.service';
import { SearchChildrenDto } from '../dtos/search-children.dto';
import { Prisma, User } from '@prisma/client';
import { omit } from 'lodash';
import { alphaNumeric } from 'src/common/functions/crypto.function';
import { MotherRepository } from 'src/app/mother/mother/repositories';
import { ENV } from '@/config/env';
// import { ChildrenSeederService } from './children-seeder.service';

@Injectable()
export class ChildrenService {
  constructor(
    private readonly childRepository: ChildrenRepository,
    private readonly filesService: FileService,
    private readonly motherRepository: MotherRepository,
    // private readonly childrenSeederService: ChildrenSeederService,
  ) {}

  // Generate child access URL
  private generateChildAccessUrl(childCode: string): string {
    const baseUrl = ENV.FRONTEND_BASE_URL;
    return `${baseUrl}/public/option-page?code=${childCode}`;
  }

  public async paginate(paginateDto: SearchChildrenDto, user: User) {
    const whereCondition: Prisma.ChildrenWhereInput = {
      userId: user.id,
      deletedAt: null,
    };

    // Tambahkan kondisi OR hanya jika ada search parameter
    if (paginateDto.search) {
      whereCondition.OR = [
        {
          name: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    return await this.childRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        childPicture: true,
        birthCertificate: true,
        kiaCard: true,
        familyCard: true,
      },
    });
  }

  public count() {
    return this.childRepository.count({
      where: {
        id: {},
      },
    });
  }

  public async detail(id: string) {
    await this.childRepository.update(
      {
        id,
        deletedAt: null,
      },
      {
        code: alphaNumeric(64),
      },
    );

    const children = await this.childRepository.firstOrThrow(
      {
        id,
        deletedAt: null,
      },
      {
        mother: true,
        childPicture: true,
        birthCertificate: true,
        kiaCard: true,
        familyCard: true,
      },
    );
    if (!children) {
      throw new Error('Children not found');
    }

    const url = this.generateChildAccessUrl(children.code as string);

    return {
      ...children,
      url,
    };
  }

  public detailByCode(code: string) {
    try {
      return this.childRepository.firstOrThrow(
        {
          code,
          deletedAt: null,
        },
        {
          mother: true,
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.childRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createChildrenDto: CreateChildrenDto, user?: User) {
    const mother = await this.motherRepository.findFirst({
      userId: user?.id,
    });
    if (!mother) {
      throw new Error('mother data does not exist');
    }

    // Upload files
    const data: Prisma.ChildrenCreateInput = {
      name: createChildrenDto.name,
      placeOfBirth: createChildrenDto.placeOfBirth,
      dateOfBirth: createChildrenDto.dateOfBirth,
      childOrder: createChildrenDto.childOrder,
      bloodType: createChildrenDto.bloodType,
      address: createChildrenDto.address,
      gender: createChildrenDto.gender,
      height: createChildrenDto.height,
      weight: createChildrenDto.weight,
      mother: { connect: { id: mother.id } },
      user: { connect: { id: user?.id } },
    };

    // generate random code
    const code = alphaNumeric(64);

    // check if code already used
    const child = await this.childRepository.first({
      code: code,
    });
    if (child) {
      Object.assign(data, {
        code: alphaNumeric(64),
      });
    }
    if (child == null) {
      Object.assign(data, {
        code: code,
      });
    }

    if (createChildrenDto.childPicture) {
      const childPicture = await this.filesService.upload({
        file: createChildrenDto.childPicture,
        fileName: createChildrenDto.name,
      });

      Object.assign(data, {
        childPicture: {
          connect: {
            id: childPicture.id,
          },
        },
      });
    }

    if (createChildrenDto.birthCertificate) {
      const birthCertificate = await this.filesService.upload({
        file: createChildrenDto.birthCertificate,
        fileName: createChildrenDto.name,
      });

      Object.assign(data, {
        birthCertificate: {
          connect: {
            id: birthCertificate.id,
          },
        },
      });
    }

    if (createChildrenDto.kiaCard) {
      const kiaCard = await this.filesService.upload({
        file: createChildrenDto.kiaCard,
        fileName: createChildrenDto.name,
      });

      Object.assign(data, {
        kiaCard: {
          connect: {
            id: kiaCard.id,
          },
        },
      });
    }

    if (createChildrenDto.familyCard) {
      const familyCard = await this.filesService.upload({
        file: createChildrenDto.familyCard,
        fileName: createChildrenDto.name,
      });

      Object.assign(data, {
        familyCard: {
          connect: {
            id: familyCard.id,
          },
        },
      });
    }

    const createdChild = await this.childRepository.create(data);

    // Seed child immunizations
    // const childrenSeed =
    //   await this.childrenSeederService.seedChildImmunizations(
    //     createdChild.id,
    //   );

    // const childAccessUrl = this.generateChildAccessUrl(
    //   createdChild.code as string,
    // );
    return {
      child: createdChild,
      // childrenSeed,
      // accessUrl: childAccessUrl,
    };
  }

  public async update(id: string, updateChildrenDto: UpdateChildrenDto) {
    // Prepare data for fields not related to file uploads
    const data: Prisma.ChildrenUpdateInput = omit(updateChildrenDto, [
      'childPicture',
      'birthCertificate',
      'kiaCard',
      'familyCard',
    ]);

    // Handle file uploads and connections for each file field
    if (updateChildrenDto.childPicture) {
      const fileChildPicture = await this.filesService.upload({
        file: updateChildrenDto.childPicture,
        fileName: updateChildrenDto.name as string,
      });

      data.childPicture = { connect: { id: fileChildPicture.id } };
    }

    if (updateChildrenDto.birthCertificate) {
      const birthCertificate = await this.filesService.upload({
        file: updateChildrenDto.birthCertificate,
        fileName: updateChildrenDto.name as string,
      });

      data.birthCertificate = {
        connect: { id: birthCertificate.id },
      };
    }

    if (updateChildrenDto.kiaCard) {
      const kiaCard = await this.filesService.upload({
        file: updateChildrenDto.kiaCard,
        fileName: updateChildrenDto.name as string,
      });

      data.kiaCard = { connect: { id: kiaCard.id } };
    }

    if (updateChildrenDto.familyCard) {
      const familyCard = await this.filesService.upload({
        file: updateChildrenDto.familyCard,
        fileName: updateChildrenDto.name as string,
      });

      data.familyCard = { connect: { id: familyCard.id } };
    }

    // Update the child record with the prepared data
    return await this.childRepository.update({ id }, data);
  }

  public async refreshCode(ChildId: string) {
    const child = await this.childRepository.firstOrThrow({
      id: ChildId,
      deletedAt: null,
    });

    if (!child) {
      throw new Error('Child not found');
    }

    const updatedCode = await this.childRepository.update(
      {
        id: ChildId,
      },
      {
        code: alphaNumeric(64),
      },
    );

    // const url = this.generateChildAccessUrl(updatedCode.code as string);

    return {
      ...updatedCode,
      // url,
    };
  }
}
