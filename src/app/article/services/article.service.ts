import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../repositories';
import { CreateArticleDto, UpdateArticleDto, SearchArticleDto } from '../dtos';
import { Filter } from '../repositories/article.repository';
import { Prisma } from '@prisma/client';
import { FileService } from 'src/app/file/services';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly fileService: FileService,
  ) {}

  public paginate(paginateDto: SearchArticleDto) {
    const whereCondition: Prisma.ArticleWhereInput = {
      deletedAt: null,
    };

    if (paginateDto.search) {
      whereCondition.OR = [
        {
          title: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: paginateDto.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.articleRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        image: true,
      },
    });
  }

  public count() {
    return this.articleRepository.count({
      where: {
        id: {},
      },
    });
  }

  public detail(id: string) {
    try {
      return this.articleRepository.firstOrThrow(
        {
          id,
          deletedAt: null,
        },
        {
          image: true,
          title: true,
          content: true,
          newsMaker: true,
          id: true,
          createdAt: true,
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.articleRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createArticleDto: CreateArticleDto) {
    try {
      const data: Prisma.ArticleCreateInput = {
        title: createArticleDto.title,
        content: createArticleDto.content,
        newsMaker: createArticleDto.newsMaker,
      };

      if (createArticleDto.image) {
        const image = await this.fileService.upload({
          file: createArticleDto.image as string,
          fileName: createArticleDto.title ?? '',
        });

        Object.assign(data, {
          image: {
            connect: {
              id: image.id,
            },
          },
        });
      }

      return this.articleRepository.create(data);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async update(id: string, updateArticleDto: UpdateArticleDto) {
    try {
      const data: Prisma.ArticleUpdateInput = {
        title: updateArticleDto.title,
        content: updateArticleDto.content,
        newsMaker: updateArticleDto.newsMaker,
      };

      if (updateArticleDto.image) {
        const image = await this.fileService.upload({
          file: updateArticleDto.image as string,
          fileName: updateArticleDto.title ?? '',
        });

        Object.assign(data, {
          image: {
            connect: {
              id: image.id,
            },
          },
        });
      }

      return this.articleRepository.update({ id }, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findMany(searchArticleDto: SearchArticleDto) {
    try {
      const filter: Filter = {
        where: {},
      };

      if (searchArticleDto.search) {
        Object.assign(filter.where || {}, {
          title: {
            contains: searchArticleDto.search,
            mode: 'insensitive',
          },
        });
      }
      return await this.articleRepository.find(filter);
    } catch (error) {
      throw new Error(`err.fetch_article`);
    }
  }
}
