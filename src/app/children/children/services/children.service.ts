import { Injectable } from '@nestjs/common';
import { ChildrenRepository } from '../repositories';
// import { CreateChildrenDto, UpdateChildrenDto } from '../dtos';
// import { FilesService } from '../../files/services/files.service';
import { ChildrenSearchDto } from '../dtos/search-children.dto';
import { Prisma, User } from '@prisma/client';
// import { omit } from 'lodash';
// import { DateTime } from 'luxon';
import { alphaNumeric } from 'src/common/functions/crypto.function';
// import { MotherRepository } from '@src/app/mother/mother/repositories';
import { env } from 'process';
// import { ChildrenSeederService } from './children-seeder.service';
@Injectable()
export class ChildrenService {
  constructor(
    private readonly childRepository: ChildrenRepository,
    // private readonly filesService: FilesService,
    // private readonly motherRepository: MotherRepository,
    // private readonly childrenSeederService: ChildrenSeederService,
  ) {}

  // Generate child access URL
  private generateChildAccessUrl(childCode: string): string {
    const baseUrl = env.FRONTEND_BASE_URL;
    return `${baseUrl}/public/option-page?code=${childCode}`;
  }

  public paginate(paginateDto: ChildrenSearchDto, user: User) {
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

    return this.childRepository
      .paginate(paginateDto, {
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
      })
      .then((data) => {
        return {
          ...data,
          data: data.data.map((child) => ({
            ...child,
            url: this.generateChildAccessUrl(child.code as string),
          })),
        };
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
    const code = await this.childRepository.update(
      {
        id,
      },
      {
        code: alphaNumeric(64),
      },
    );

    const child = await this.childRepository.firstOrThrow(
      {
        id,
        code: code.code as string,
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

    // Dynamically generate URL
    const url = this.generateChildAccessUrl(child.code as string);

    // Return the child data along with the generated URL
    return {
      ...child,
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

  // public detailByUrl(url: string) {
  //   try {
  //     return this.childRepository.findOne(
  //       {
  //         url,
  //         deletedAt: null,
  //       },
  //       {
  //         parents: true,
  //       },
  //     );
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  public async destroy(id: string) {
    try {
      return this.childRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // public async create(createChildrenDto: CreateChildrenDto, user: User) {
  //   try {
  //     // const age = Math.abs(
  //     //   DateTime.fromISO(createChildrenDto.dateOfBirth).diffNow('years')
  //     //     .years || 0,
  //     // );

  //     // const parent = await this.motherRepository.findOne({
  //     //   userId: user.id,
  //     // });

  //     // if (!mother) {
  //     //   throw new Error('mother data does not exist');
  //     // }

  //     // Upload files
  //     const data: Prisma.ChildrenCreateInput = {
  //       name: createChildrenDto.name,
  //       placeOfBirth: createChildrenDto.placeOfBirth,
  //       dateOfBirth: createChildrenDto.dateOfBirth,
  //       childOrder: createChildrenDto.childOrder,
  //       bloodType: createChildrenDto.bloodType,
  //       address: createChildrenDto.address,
  //       gender: createChildrenDto.gender,
  //       height: createChildrenDto.height,
  //       weight: createChildrenDto.weight,
  //       // mother: { connect: { id: mother.id } },
  //     };

  //     // relation to user
  //     Object.assign(data, {
  //       user: { connect: { id: user.id } },
  //     });

  //     // generate random code
  //     const code = alphaNumeric(64);

  //     // check if code already used
  //     const child = await this.childRepository.first({
  //       code: code,
  //     });
  //     if (child) {
  //       Object.assign(data, {
  //         code: alphaNumeric(64),
  //       });
  //     }
  //     if (child == null) {
  //       Object.assign(data, {
  //         code: code,
  //       });
  //     }

  //     // if (createChildrenDto.childPicture) {
  //     //   const childPicture = await this.filesService.upload({
  //     //     file: createChildrenDto.childPicture,
  //     //     fileName: createChildrenDto.name,
  //     //   });

  //     //   Object.assign(data, {
  //     //     childPicture: { connect: { id: childPicture.id } },
  //     //   });
  //     // }

  //     // if (createChildrenDto.fileBirthCertificate) {
  //     //   const fileBirthCertificate = await this.filesService.upload({
  //     //     file: createChildrenDto.fileBirthCertificate,
  //     //     fileName: createChildrenDto.name,
  //     //   });

  //     //   Object.assign(data, {
  //     //     fileBirthCertificate: { connect: { id: fileBirthCertificate.id } },
  //     //   });
  //     // }

  //     // if (createChildrenDto.fileChildIdentity) {
  //     //   const fileChildIdentity = await this.filesService.upload({
  //     //     file: createChildrenDto.fileChildIdentity,
  //     //     fileName: createChildrenDto.name,
  //     //   });

  //     //   Object.assign(data, {
  //     //     fileChildIdentity: { connect: { id: fileChildIdentity.id } },
  //     //   });
  //     // }

  //     // if (createChildrenDto.fileFamilyCard) {
  //     //   const fileFamilyCard = await this.filesService.upload({
  //     //     file: createChildrenDto.fileFamilyCard,
  //     //     fileName: createChildrenDto.name,
  //     //   });

  //     //   Object.assign(data, {
  //     //     fileFamilyCard: { connect: { id: fileFamilyCard.id } },
  //     //   });
  //     // }

  //     const createdChild = await this.childRepository.create(data);

  //     // Seed child immunizations
  //     // const childrenSeed =
  //     //   await this.childrenSeederService.seedChildImmunizations(
  //     //     createdChild.id,
  //     //   );

  //     const childAccessUrl = this.generateChildAccessUrl(
  //       createdChild.code as string,
  //     );
  //     return {
  //       child: createdChild,
  //       // childrenSeed,
  //       accessUrl: childAccessUrl,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(error);
  //   }
  // }

  // public async update(id: string, updateChildrenDto: UpdateChildrenDto) {
  //   // Prepare data for fields not related to file uploads
  //   // const data: Prisma.ChildrenUpdateInput = omit(updateChildrenDto, [
  //   //   'childPicture',
  //   //   'birthCertificate',
  //   //   'kiaCard',
  //   //   'familyCard',
  //   // ]);]
  //   // if (updateChildrenDto.dateOfBirth) {
  //   //   const age = Math.abs(
  //   //     DateTime.fromISO(updateChildrenDto.dateOfBirth).diffNow('years')
  //   //       .years || 0,
  //   //   );
  //   //   Object.assign(data, {
  //   //     age: age,
  //   //   });
  //   // }
  //   // Handle file uploads and connections for each file field
  //   // if (updateChildrenDto.childPicture) {
  //   //   const fileChildPicture = await this.filesService.upload({
  //   //     file: updateChildrenDto.childPicture,
  //   //     fileName: updateChildrenDto.name as string,
  //   //   });
  //   //   data.childPicture = { connect: { id: fileChildPicture.id } };
  //   // }
  //   // if (updateChildrenDto.fileBirthCertificate) {
  //   //   const fileBirthCertificate = await this.filesService.upload({
  //   //     file: updateChildrenDto.fileBirthCertificate,
  //   //     fileName: updateChildrenDto.name as string,
  //   //   });
  //   //   data.fileBirthCertificate = {
  //   //     connect: { id: fileBirthCertificate.id },
  //   //   };
  //   // }
  //   // if (updateChildrenDto.fileChildIdentity) {
  //   //   const fileChildIdentity = await this.filesService.upload({
  //   //     file: updateChildrenDto.fileChildIdentity,
  //   //     fileName: updateChildrenDto.name as string,
  //   //   });
  //   //   data.fileChildIdentity = { connect: { id: fileChildIdentity.id } };
  //   // }
  //   // if (updateChildrenDto.fileFamilyCard) {
  //   //   const fileFamilyCard = await this.filesService.upload({
  //   //     file: updateChildrenDto.fileFamilyCard,
  //   //     fileName: updateChildrenDto.name as string,
  //   //   });
  //   //   data.fileFamilyCard = { connect: { id: fileFamilyCard.id } };
  // }

  // // Update the child record with the prepared data
  // data = await this.childRepository.update({ id }, data);

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

    const url = this.generateChildAccessUrl(updatedCode.code as string);

    return {
      ...updatedCode,
      url,
    };
  }
}
