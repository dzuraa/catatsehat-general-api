import { Injectable } from '@nestjs/common';
import { LungsRepository } from '../repositories';
import { CreateLungsDto, UpdateLungsDto } from '../dtos';
import { GetLungsDto } from '../dtos/get-lugs.dto';
import { DateTime } from 'luxon';
import { generatePdfBase64 } from '@/common/functions/pdf.function';

@Injectable()
export class LungsService {
  constructor(private readonly lungsRepository: LungsRepository) {}

  public paginate(paginateDto: GetLungsDto) {
    return this.lungsRepository.paginate(paginateDto, {
      include: {
        elderly: true,
        lungsPivot: {
          include: {
            masterDataLungs: true,
          },
        },
        lungsConclution: true,
      },
      where: {
        OR: [
          {
            elderly: {
              name: {
                contains: paginateDto.search,
                mode: 'insensitive',
              },
            },
            createdAt: paginateDto.date
              ? {
                  gte: DateTime.fromISO(paginateDto.date)
                    .startOf('day')
                    .toUTC()
                    .toJSDate(),
                  lte: DateTime.fromISO(paginateDto.date)
                    .endOf('day')
                    .toUTC()
                    .toJSDate(),
                }
              : undefined,
          },
        ],
      },
    });
  }

  public detail(id: string) {
    try {
      return this.lungsRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.lungsRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createLungsDto: CreateLungsDto) {
    try {
      return this.lungsRepository.create({
        elderly: {
          connect: {
            id: createLungsDto.elderlyId,
          },
        },
        lungsConclution: {
          connect: {
            id: createLungsDto.conclusionId,
          },
        },
        lungsPivot: {
          createMany: {
            data: createLungsDto.responses.map((response) => ({
              value: response.value,
              masterDataLungsId: response.id,
            })),
          },
        },
        score: createLungsDto.score,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateLungsDto: UpdateLungsDto) {
    try {
      return this.lungsRepository.update({ id }, updateLungsDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async generatePdf(id: string) {
    try {
      const lungs = await this.lungsRepository.getData(id);

      // Assuming generatePdfBase64 is imported from the pdf function file
      return {
        pdf: await generatePdfBase64(
          `<!-- lungs-report-template.html (as string in TS) -->
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-10 text-gray-800">
    <h1 class="text-center text-2xl font-bold mb-4">Detail Pemeriksaan Paru</h1>
    <br />
    <p><strong>Nama:</strong> {{elderly.name}}</p>
    <p><strong>Tempat & Tanggal Lahir:</strong> {{elderly.placeOfBirth}}, {{formatDate elderly.dateOfBirth}}</p>
    <p><strong>Umur:</strong> {{calculateAge elderly.dateOfBirth}} tahun</p>
    <p><strong>Jenis Kelamin:</strong> {{genderText elderly.gender}}</p>
    <p><strong>Alamat:</strong> {{elderly.address}}</p>
    
    <hr class="my-4" />
    <h2 class="text-lg font-semibold">Hasil Pemeriksaan:</h2>
    <ul class="list-disc pl-6">
{{#each lungsPivot}}
  <li>
    {{masterDataLungs.question}} - 
    {{#if value}}Ya{{else}}Tidak{{/if}}
  </li>
{{/each}}
    </ul>
    <br />
    <div class="mt-6 p-4 bg-green-100 border rounded">
      <strong>Kesimpulan:</strong> {{lungsConclution.conclusion}}
      <p>{{lungsConclution.description}}</p>
    </div>
  </body>
</html>
`,
          lungs,
        ),
        lungs,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
