import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/platform/database/services/prisma.service';

@Injectable()
export class PostPartumSeederService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Seed PostPartumRecord untuk ibu yang baru dibuat.
   * @param motherId - ID dari ibu (Mother)
   */
  async seedPostPartumRecords(motherId: string) {
    try {
      // Ambil semua DayPostPartum (misalnya Day 1 - 42)
      const days = await this.prisma.dayPostPartum.findMany();

      const createPromises = days.map((day) =>
        this.prisma.postPartumRecord.upsert({
          where: {
            motherId_dayPostPartumId: {
              motherId,
              dayPostPartumId: day.id,
            },
          },
          update: {}, // Jika sudah ada, biarkan
          create: {
            mother: { connect: { id: motherId } },
            dayPostPartum: { connect: { id: day.id } },

            status: null,
          },
        }),
      );

      await Promise.all(createPromises);

      return {
        message: `PostPartumRecords seeded for mother ${motherId}`,
      };
    } catch (error) {
      console.error('Error seeding PostPartumRecords:', error);
      throw error;
    }
  }
}
