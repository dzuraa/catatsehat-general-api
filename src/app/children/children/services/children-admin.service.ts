import { Injectable } from '@nestjs/common';
import { ChildrenRepository } from '../repositories';
import { FileService } from 'src/app/file/services/file.service';
import { SearchChildrenDto } from '../dtos/search-children.dto';
import { Prisma } from '@prisma/client';
import { alphaNumeric } from 'src/common/functions/crypto.function';
import { MotherRepository } from 'src/app/mother/mother/repositories';
import { env } from 'process';
// import { ChildrenSeederService } from './children-seeder.service';

@Injectable()
export class ChildrenAdminService {
  constructor(
    private readonly childRepository: ChildrenRepository,
    private readonly filesService: FileService,
    private readonly motherRepository: MotherRepository,
    // private readonly childrenSeederService: ChildrenSeederService,
  ) {}

  // Generate child access URL
  private generateChildAccessUrl(childCode: string): string {
    const baseUrl = env.FRONTEND_BASE_URL;
    return `${baseUrl}/public/option-page?code=${childCode}`;
  }

  public paginate(paginateDto: SearchChildrenDto) {
    const whereCondition: Prisma.ChildrenWhereInput = {
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

    return this.childRepository.paginate(paginateDto, {
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
    const code = await this.childRepository.update(
      {
        id,
        deletedAt: null,
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

  public async destroy(id: string) {
    try {
      return this.childRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
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

    const url = this.generateChildAccessUrl(updatedCode.code as string);

    return {
      ...updatedCode,
      url,
    };
  }
}
