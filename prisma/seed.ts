import { PrismaClient } from '@prisma/client';
import * as csv from 'csv-parser';
import { createReadStream } from 'fs';
import { configDotenv } from 'dotenv';
import { hashSync } from '@node-rs/bcrypt';
import { AdminType } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();
configDotenv();

// Helper function untuk membaca CSV
async function readCsvFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    createReadStream(path.resolve(__dirname, 'seeds', filePath))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Helper function untuk membuat data jika belum ada
async function createIfNotExists(
  model: any,
  modelName: string,
  data: any,
  uniqueField: string,
) {
  try {
    const existing = await model.findUnique({
      where: {
        [uniqueField]: data[uniqueField],
      },
    });

    if (!existing) {
      await model.create({
        data,
      });
      return 'created';
    }
    return 'skipped';
  } catch (error) {
    console.error(`Error processing ${modelName}:`, data, error);
    return 'error';
  }
}

async function seedLocations() {
  try {
    // Seed provinces
    console.log('Seeding provinces...');
    const provinces = await readCsvFile('provinces.csv');
    let stats = { created: 0, skipped: 0, error: 0 };

    for (const data of provinces) {
      const result = await createIfNotExists(
        prisma.province,
        'Province',
        {
          name: data.P,
          id: data.I,
        },
        'id',
      );
      stats[result]++;
    }
    console.log(`Provinces processed: ${JSON.stringify(stats)}`);

    // Seed regencies
    console.log('Seeding regencies...');
    stats = { created: 0, skipped: 0, error: 0 };
    const regencies = await readCsvFile('regencies.csv');

    for (const data of regencies) {
      const result = await createIfNotExists(
        prisma.regency,
        'Regency',
        {
          name: data.N,
          id: data.I,
          provinceId: data.P,
        },
        'id',
      );
      stats[result]++;
    }
    console.log(`Regencies processed: ${JSON.stringify(stats)}`);

    // Seed districts
    console.log('Seeding districts...');
    stats = { created: 0, skipped: 0, error: 0 };
    const districts = await readCsvFile('districts.csv');

    for (const data of districts) {
      const result = await createIfNotExists(
        prisma.district,
        'District',
        {
          name: data.N,
          id: data.I,
          regencyId: data.R,
        },
        'id',
      );
      stats[result]++;
    }
    console.log(`Districts processed: ${JSON.stringify(stats)}`);

    // Seed sub-districts with batching
    console.log('Seeding sub-districts...');
    const subDistricts = await readCsvFile('villages.csv');
    stats = { created: 0, skipped: 0, error: 0 };
    const batchSize = 100;

    for (let i = 0; i < subDistricts.length; i += batchSize) {
      const batch = subDistricts.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((data) =>
          createIfNotExists(
            prisma.subDistrict,
            'SubDistrict',
            {
              name: data.N,
              id: data.I,
              districtId: data.D,
            },
            'id',
          ),
        ),
      );

      results.forEach((result) => stats[result]++);

      console.log(
        `Processed ${i + batch.length} / ${subDistricts.length} sub-districts...`,
      );
      console.log(`Current stats: ${JSON.stringify(stats)}`);
    }

    console.log(`Sub-districts final stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('Error in seeding locations:', error);
    throw error;
  }
}

async function seedDataMaster() {
  try {
    console.log('Checking admins...');
    const adminEmails = [
      {
        name: 'Super Admin',
        email: 'superadmin@catatsehat.com',
        type: 'SUPER_ADMIN',
        phone: '089668665544',
      },
      {
        name: 'Admin Kader',
        email: 'admin@catatsehat.com',
        type: 'KADER',
        phone: '085900251266',
      },
    ];

    const existingAdmins = await prisma.admin.findMany({
      where: {
        email: { in: adminEmails.map((admin) => admin.email) },
      },
      select: { email: true },
    });

    const existingEmails = existingAdmins.map((admin) => admin.email);

    const adminsToCreate = adminEmails.filter(
      (admin) => !existingEmails.includes(admin.email),
    );

    if (adminsToCreate.length > 0) {
      for (const admin of adminsToCreate) {
        await prisma.admin.create({
          data: {
            name: admin.name,
            email: admin.email,
            type: admin.type as AdminType,
            password: hashSync('Admin123#', 10),
            phone: admin.phone,
          },
        });
        console.log(`Admin ${admin.email} created successfully`);
      }
    } else {
      console.log('All required admins already exist, skipping...');
    }

    console.log('Checking user...');
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: '089668665544',
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: 'Main User',
          phone: '089668665544',
          pin: hashSync('123456', 10),
          status: 'ACTIVE',
        },
      });
      console.log('User created successfully');
    } else {
      console.log('User already exists, skipping...');
    }

    console.log('Checking health posts...');
    const existingHealthPosts = await prisma.healthPost.findFirst({
      where: {
        name: 'Posyandu Utama',
      },
    });

    const adminPosyandu = await prisma.admin.findFirst({
      where: {
        email: 'admin@catatsehat.com',
      },
    });

    if (!adminPosyandu) {
      throw new Error('Admin Posyandu not found');
    }

    if (!existingHealthPosts) {
      await prisma.healthPost.create({
        data: {
          name: 'Posyandu Utama',
          address: 'Jl. Posyandu Utama No. 1',
          subDistrict: { connect: { id: '3404050002' } },
        },
      });
      console.log('Health post created successfully');
    } else {
      console.log('Health post already exists, skipping...');
    }

    console.log('Connecting Super Admin to Posyandu Utama...');
    if (!adminPosyandu.healthPostId) {
      await prisma.admin.update({
        where: {
          id: adminPosyandu.id,
        },
        data: {
          healthPostId: existingHealthPosts?.id,
        },
      });
      console.log('Super Admin connected successfully to Posyandu Utama');
    } else {
      console.log(
        'Super Admin already connected to Posyandu Utama, skipping...',
      );
    }
  } catch (error) {
    console.error('Error seeding data master:', error);
  }
}

// async function seedVaccines() {
//   // Data Master Vaksin dan Tahapannya
//   const vaccines = [
//     {
//       name: 'Hepatitis B (<24 Jam)',
//       stages: [
//         { name: 'Hepatitis B (<24 Jam)', suggestedAge: 'Dibawah 24 Jam' },
//       ],
//     },
//     {
//       name: 'BCG',
//       stages: [{ name: 'BCG', suggestedAge: '0 - 1 Bulan' }],
//     },
//     {
//       name: 'Polio Tetes',
//       stages: [
//         { name: 'Polio Tetes 1', suggestedAge: '0 - 1 Bulan' },
//         { name: 'Polio Tetes 2', suggestedAge: '2 Bulan' },
//         { name: 'Polio Tetes 3', suggestedAge: '3 Bulan' },
//         { name: 'Polio Tetes 4', suggestedAge: '4 Bulan' },
//       ],
//     },
//     {
//       name: 'DPT-HB-Hib',
//       stages: [
//         { name: 'DPT-HB-Hib 1', suggestedAge: '2 Bulan' },
//         { name: 'DPT-HB-Hib 2', suggestedAge: '3 Bulan' },
//         { name: 'DPT-HB-Hib 3', suggestedAge: '4 Bulan' },
//         { name: 'DPT-HB-Hib Lanjutan', suggestedAge: '18 Bulan' },
//       ],
//     },
//     {
//       name: 'Rota Virus (RV)',
//       stages: [
//         { name: 'Rota Virus (RV) 1', suggestedAge: '2 Bulan' },
//         { name: 'Rota Virus (RV) 2', suggestedAge: '3 Bulan' },
//         { name: 'Rota Virus (RV) 3', suggestedAge: '4 Bulan' },
//       ],
//     },
//     {
//       name: 'PCV',
//       stages: [
//         { name: 'PCV 1', suggestedAge: '2 Bulan' },
//         { name: 'PCV 2', suggestedAge: '3 Bulan' },
//         { name: 'PCV 3', suggestedAge: '12 Bulan' },
//       ],
//     },
//     {
//       name: 'Polio Suntik (IPV)',
//       stages: [
//         { name: 'Polio Suntik (IPV) 1', suggestedAge: '4 Bulan' },
//         { name: 'Polio Suntik (IPV) 2', suggestedAge: '9 Bulan' },
//       ],
//     },
//     {
//       name: 'Campak -Rubella (MR)',
//       stages: [
//         { name: 'Campak -Rubella (MR)', suggestedAge: '9 Bulan' },
//         { name: 'Campak -Rubella (MR) Lanjutan', suggestedAge: '18 Bulan' },
//       ],
//     },
//     {
//       name: 'Japanese Encephalitis (JE)',
//       stages: [
//         { name: 'Japanese Encephalitis (JE)', suggestedAge: '10 Bulan' },
//       ],
//     },
//   ];

//   try {
//     for (const vaccine of vaccines) {
//       // Periksa apakah vaksin sudah ada berdasarkan nama
//       const existingVaccine = await prisma.vaccine.findFirst({
//         where: { name: vaccine.name },
//       });

//       if (!existingVaccine) {
//         // Jika vaksin belum ada, tambahkan data vaksin beserta tahapannya
//         const createdVaccine = await prisma.vaccine.create({
//           data: {
//             name: vaccine.name,
//             VaccineStage: {
//               create: vaccine.stages.map((stage) => ({
//                 name: stage.name,
//                 suggestedAge: stage.suggestedAge,
//               })),
//             },
//           },
//         });

//         console.log(`Created vaccine: ${createdVaccine.name}`);
//       } else {
//         // Periksa apakah ada tahap baru yang perlu ditambahkan
//         for (const stage of vaccine.stages) {
//           const existingStage = await prisma.vaccineStage.findFirst({
//             where: {
//               name: stage.name,
//               vaccineId: existingVaccine.id,
//             },
//           });

//           if (!existingStage) {
//             // Tambahkan tahap baru jika belum ada
//             await prisma.vaccineStage.create({
//               data: {
//                 name: stage.name,
//                 suggestedAge: stage.suggestedAge,
//                 vaccineId: existingVaccine.id,
//               },
//             });
//             console.log(
//               `Added new stage: ${stage.name} for vaccine: ${existingVaccine.name}`,
//             );
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error in seeding vaccines:', error);
//     throw error;
//   }
// }

async function main() {
  try {
    console.log('Starting seed process...');

    // Seed locations first (provinces, regencies, districts, etc)
    await seedLocations();

    // Then seed data master
    await seedDataMaster();

    // Lastly, seed vaccines
    // await seedVaccines();

    console.log('Seed process completed successfully');
  } catch (error) {
    console.error('Error in main seed process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error in main:', error);
  process.exit(1);
});
