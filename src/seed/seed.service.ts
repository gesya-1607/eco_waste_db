import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async runSeed(appMakerId: number) {
    // ==========================================
    // CEK APP MAKER
    // ==========================================
    const appMaker =
      await this.prisma.appmaker.findUnique({
        where: {
          id: appMakerId,
        },
      });

    if (!appMaker) {
      throw new ConflictException(
        'App Maker tidak ditemukan',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        // ==========================================
        // CEK DATA SEED SUDAH ADA ATAU BELUM
        // ==========================================
        const existingAdmin =
          await tx.user.findFirst({
            where: {
              appMakerId,
              username: 'admin',
            },
          });

        if (existingAdmin) {
          throw new ConflictException(
            'Data seed untuk App Maker ini sudah dibuat',
          );
        }

        // ==========================================
        // PASSWORD DEFAULT
        // ==========================================
        const hashedPassword =
          await bcrypt.hash(
            'password123',
            10,
          );

        // ==========================================
        // 1. ADMIN
        // ==========================================
        const adminUser =
          await tx.user.create({
            data: {
              appMakerId,

              username: 'admin',

              password:
                hashedPassword,

              role: 'ADMIN',

              updatedAt:
                new Date(),
            },
          });

        const adminBank =
          await tx.adminbank.create({
            data: {
              appMakerId,

              userId:
                adminUser.id,

              namaUnit:
                'Bank Sampah Eco Waste',

              namaPengelola:
                'Admin Eco Waste',

              telp:
                '081234567890',

              updatedAt:
                new Date(),
            },
          });

        // ==========================================
        // 2. NASABAH
        // ==========================================
        const nasabahData = [
          {
            username:
              'nasabah1',

            namaNasabah:
              'Nasabah Satu',

            alamat:
              'Malang',

            telp:
              '081234567891',
          },

          {
            username:
              'nasabah2',

            namaNasabah:
              'Nasabah Dua',

            alamat:
              'Malang',

            telp:
              '081234567892',
          },
        ];

        const nasabahCreated: any[] = [];

        for (
          const data of nasabahData
        ) {
          const user =
            await tx.user.create({
              data: {
                appMakerId,

                username:
                  data.username,

                password:
                  hashedPassword,

                role:
                  'NASABAH',

                updatedAt:
                  new Date(),
              },
            });

          const nasabah =
            await tx.nasabah.create({
              data: {
                appMakerId,

                userId:
                  user.id,

                namaNasabah:
                  data.namaNasabah,

                alamat:
                  data.alamat,

                telp:
                  data.telp,

                saldoPoin:
                  0,

                updatedAt:
                  new Date(),
              },
            });

          nasabahCreated.push(
            nasabah,
          );
        }

        // ==========================================
        // 3. KATEGORI SAMPAH
        // ==========================================
        const kategoriData = [
          {
            namaKategori:
              'Botol Plastik',

            hargaPerKg:
              5000,

            poinPerKg:
              10,

            jenis:
              'plastik' as const,
          },

          {
            namaKategori:
              'Kertas',

            hargaPerKg:
              3000,

            poinPerKg:
              6,

            jenis:
              'kertas' as const,
          },

          {
            namaKategori:
              'Kaleng',

            hargaPerKg:
              7000,

            poinPerKg:
              14,

            jenis:
              'logam' as const,
          },

          {
            namaKategori:
              'Botol Kaca',

            hargaPerKg:
              4000,

            poinPerKg:
              8,

            jenis:
              'kaca' as const,
          },
        ];

        const kategoriCreated: any[] = [];

        for (
          const data of kategoriData
        ) {
          const kategori =
            await tx.kategorisampah.create({
              data: {
                appMakerId,

                namaKategori:
                  data.namaKategori,

                hargaPerKg:
                  data.hargaPerKg,

                poinPerKg:
                  data.poinPerKg,

                jenis:
                  data.jenis,

                updatedAt:
                  new Date(),
              },
            });

          kategoriCreated.push(
            kategori,
          );
        }

        // ==========================================
        // 4. HADIAH
        // ==========================================
        const hadiahData = [
          {
            namaHadiah:
              'Voucher Belanja',

            poinDibutuhkan:
              100,

            stok:
              10,
          },

          {
            namaHadiah:
              'Tumbler',

            poinDibutuhkan:
              150,

            stok:
              5,
          },

          {
            namaHadiah:
              'Tas Belanja',

            poinDibutuhkan:
              200,

            stok:
              5,
          },
        ];

        const hadiahCreated: any[] = [];

        for (
          const data of hadiahData
        ) {
          const hadiah =
            await tx.hadiah.create({
              data: {
                appMakerId,

                namaHadiah:
                  data.namaHadiah,

                poinDibutuhkan:
                  data.poinDibutuhkan,

                stok:
                  data.stok,

                updatedAt:
                  new Date(),
              },
            });

          hadiahCreated.push(
            hadiah,
          );
        }

        // ==========================================
        // REFERENSI DATA
        // ==========================================
        const nasabah1 =
          nasabahCreated[0];

        const nasabah2 =
          nasabahCreated[1];

        const kategoriPlastik =
          kategoriCreated[0];

        const kategoriKertas =
          kategoriCreated[1];

        const kategoriLogam =
          kategoriCreated[2];

        const kategoriKaca =
          kategoriCreated[3];

        // ==========================================
        // 5. HISTORI SETOR NASABAH 1
        // ==========================================
        const setor1 =
          await tx.setorsampah.create({
            data: {
              appMakerId,

              nasabahId:
                nasabah1.id,

              kodeSetor:
                `SEED-SETOR-${Date.now()}-1`,

              tanggal:
                new Date(),

              catatan:
                'Data histori seed',

              status:
                'selesai',

              totalBeratKg:
                11.0,

              totalPoin:
                102,

              totalBayar:
                51000,

              catatanAdmin:
                'Setor selesai',

              updatedAt:
                new Date(),

              detailsetor: {
                create: [
                  {
                    kategorisampah: {
                      connect: {
                        id:
                          kategoriPlastik.id,
                      },
                    },

                    beratKgEstimasi:
                      9.0,

                    beratKgReal:
                      9.0,

                    hargaPerKg:
                      kategoriPlastik.hargaPerKg,

                    poinPerKg:
                      kategoriPlastik.poinPerKg,

                    subtotalBayar:
                      45000,

                    subtotalPoin:
                      90,
                  },

                  {
                    kategorisampah: {
                      connect: {
                        id:
                          kategoriKertas.id,
                      },
                    },

                    beratKgEstimasi:
                      2.0,

                    beratKgReal:
                      2.0,

                    hargaPerKg:
                      kategoriKertas.hargaPerKg,

                    poinPerKg:
                      kategoriKertas.poinPerKg,

                    subtotalBayar:
                      6000,

                    subtotalPoin:
                      12,
                  },
                ],
              },
            },
          });

        // ==========================================
        // 6. HISTORI SETOR NASABAH 2
        // ==========================================
        const setor2 =
          await tx.setorsampah.create({
            data: {
              appMakerId,

              nasabahId:
                nasabah2.id,

              kodeSetor:
                `SEED-SETOR-${Date.now()}-2`,

              tanggal:
                new Date(),

              catatan:
                'Data histori seed',

              status:
                'selesai',

              totalBeratKg:
                5.0,

              totalPoin:
                52,

              totalBayar:
                26000,

              catatanAdmin:
                'Setor selesai',

              updatedAt:
                new Date(),

              detailsetor: {
                create: [
                  {
                    kategorisampah: {
                      connect: {
                        id:
                          kategoriLogam.id,
                      },
                    },

                    beratKgEstimasi:
                      2.0,

                    beratKgReal:
                      2.0,

                    hargaPerKg:
                      kategoriLogam.hargaPerKg,

                    poinPerKg:
                      kategoriLogam.poinPerKg,

                    subtotalBayar:
                      14000,

                    subtotalPoin:
                      28,
                  },

                  {
                    kategorisampah: {
                      connect: {
                        id:
                          kategoriKaca.id,
                      },
                    },

                    beratKgEstimasi:
                      3.0,

                    beratKgReal:
                      3.0,

                    hargaPerKg:
                      kategoriKaca.hargaPerKg,

                    poinPerKg:
                      kategoriKaca.poinPerKg,

                    subtotalBayar:
                      12000,

                    subtotalPoin:
                      24,
                  },
                ],
              },
            },
          });

        // ==========================================
        // 7. TAMBAHKAN POIN HASIL HISTORI SETOR
        // ==========================================
        await tx.nasabah.update({
          where: {
            id:
              nasabah1.id,
          },

          data: {
            saldoPoin:
              102,
          },
        });

        await tx.nasabah.update({
          where: {
            id:
              nasabah2.id,
          },

          data: {
            saldoPoin:
              52,
          },
        });

        // ==========================================
        // 8. HISTORI PENUKARAN POIN
        // ==========================================
        const hadiahVoucher =
          hadiahCreated[0];

        const penukaran1 =
          await tx.penukaranpoin.create({
            data: {
              appMakerId,

              nasabahId:
                nasabah1.id,

              hadiahId:
                hadiahVoucher.id,

              kodePenukaran:
                `SEED-TUKAR-${Date.now()}-1`,

              tanggal:
                new Date(),

              poinTerpakai:
                hadiahVoucher.poinDibutuhkan,

              status:
                'selesai',
            },
          });

        // ==========================================
        // KURANGI SALDO POIN NASABAH
        // ==========================================
        await tx.nasabah.update({
          where: {
            id:
              nasabah1.id,
          },

          data: {
            saldoPoin: {
              decrement:
                hadiahVoucher.poinDibutuhkan,
            },
          },
        });

        // ==========================================
        // KURANGI STOK HADIAH
        // ==========================================
        await tx.hadiah.update({
          where: {
            id:
              hadiahVoucher.id,
          },

          data: {
            stok: {
              decrement:
                1,
            },
          },
        });

        // ==========================================
        // RETURN DATA
        // ==========================================
        return {
          statusCode:
            201,

          success:
            true,

          message:
            'Data seed berhasil dibuat',

          data: {
            admin: {
              user:
                adminUser,

              bank:
                adminBank,

              password:
                'password123',
            },

            nasabah:
              nasabahCreated,

            kategoriSampah:
              kategoriCreated,

            hadiah:
              hadiahCreated,

            historiSetor: [
              setor1,
              setor2,
            ],

            historiPenukaran: [
              penukaran1,
            ],
          },
        };
      },
    );
  }
}
