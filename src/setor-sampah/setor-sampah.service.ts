import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto';
import { VerifySetorSampahDto } from './dto/verify-setor-sampah.dto';

@Injectable()
export class SetorSampahService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // PENGAJUAN SETOR SAMPAH
  // POST /api/v1/setor-sampah/pengajuan
  // ==========================================
  async createPengajuan(
    dto: CreateSetorSampahDto,
    userId: number,
    appMakerId: number,
  ) {
    const nasabah =
      await this.prisma.nasabah.findFirst({
        where: {
          userId,
          appMakerId,
        },
      });

    if (!nasabah) {
      throw new NotFoundException(
        'Data nasabah tidak ditemukan',
      );
    }

    if (!dto.items || dto.items.length === 0) {
      throw new NotFoundException(
        'Item setor sampah harus diisi',
      );
    }

    const kategoriIds = dto.items.map(
      (item) => item.kategoriSampahId,
    );

    const kategori =
      await this.prisma.kategorisampah.findMany({
        where: {
          id: {
            in: kategoriIds,
          },
          appMakerId,
        },
      });

    if (kategori.length !== kategoriIds.length) {
      throw new NotFoundException(
        'Kategori sampah tidak ditemukan',
      );
    }

    const kodeSetor =
      `SETOR-${Date.now()}`;

    const setor =
      await this.prisma.setorsampah.create({
        data: {
          appMakerId,
          nasabahId: nasabah.id,
          kodeSetor,
          tanggal: new Date(dto.tanggal),
          catatan: dto.catatan ?? '',
          status: 'menunggu_konfirmasi',
          updatedAt: new Date(),

          detailsetor: {
            create: dto.items.map((item) => {
              const kategoriSampah =
                kategori.find(
                  (k) =>
                    k.id ===
                    item.kategoriSampahId,
                );

              return {
                kategorisampah: {
                  connect: {
                    id:
                      item.kategoriSampahId,
                  },
                },
                beratKgEstimasi:
                  item.beratKg,
                hargaPerKg:
                  kategoriSampah!.hargaPerKg,
                poinPerKg:
                  kategoriSampah!.poinPerKg,
                subtotalBayar: Math.round(
                  item.beratKg *
                    kategoriSampah!.hargaPerKg,
                ),
                subtotalPoin: Math.round(
                  item.beratKg *
                    kategoriSampah!.poinPerKg,
                ),
              };
            }),
          },
        },

        include: {
          detailsetor: {
            include: {
              kategorisampah: true,
            },
          },
        },
      });

    // ==========================================
    // HITUNG TOTAL ESTIMASI
    // ==========================================
    const totalBeratKg =
      dto.items.reduce(
        (total, item) =>
          total + item.beratKg,
        0,
      );

    const totalPoin =
      dto.items.reduce(
        (total, item) => {
          const kategoriSampah =
            kategori.find(
              (k) =>
                k.id ===
                item.kategoriSampahId,
            );

          return (
            total +
            Math.round(
              item.beratKg *
                kategoriSampah!.poinPerKg,
            )
          );
        },
        0,
      );

    const totalBayar =
      dto.items.reduce(
        (total, item) => {
          const kategoriSampah =
            kategori.find(
              (k) =>
                k.id ===
                item.kategoriSampahId,
            );

          return (
            total +
            Math.round(
              item.beratKg *
                kategoriSampah!.hargaPerKg,
            )
          );
        },
        0,
      );

    // ==========================================
    // UPDATE TOTAL SETOR
    // ==========================================
    const updatedSetor =
      await this.prisma.setorsampah.update({
        where: {
          id: setor.id,
        },
        data: {
          totalBeratKg,
          totalPoin,
          totalBayar,
        },
        include: {
          detailsetor: {
            include: {
              kategorisampah: true,
            },
          },
        },
      });

    return {
      statusCode: 201,
      success: true,
      message:
        'Pengajuan setor sampah berhasil dibuat',
      data: updatedSetor,
    };
  }

  // ==========================================
  // RIWAYAT SETOR NASABAH
  // GET /api/v1/setor-sampah/my-setor
  // ==========================================
  async getMySetor(
    userId: number,
    appMakerId: number,
    bulan?: string,
  ) {
    const nasabah =
      await this.prisma.nasabah.findFirst({
        where: {
          userId,
          appMakerId,
        },
      });

    if (!nasabah) {
      throw new NotFoundException(
        'Data nasabah tidak ditemukan',
      );
    }

    const where: any = {
      nasabahId: nasabah.id,
      appMakerId,
    };

    if (bulan) {
      const [tahun, nomorBulan] =
        bulan.split('-').map(Number);

      const tanggalMulai = new Date(
        tahun,
        nomorBulan - 1,
        1,
      );

      const tanggalAkhir = new Date(
        tahun,
        nomorBulan,
        1,
      );

      where.tanggal = {
        gte: tanggalMulai,
        lt: tanggalAkhir,
      };
    }

    const setor =
      await this.prisma.setorsampah.findMany({
        where,
        orderBy: {
          tanggal: 'desc',
        },
        include: {
          detailsetor: {
            include: {
              kategorisampah: true,
            },
          },
        },
      });

    return {
      statusCode: 200,
      success: true,
      message:
        'Riwayat setor sampah berhasil diambil',
      data: setor,
    };
  }

  // ==========================================
  // LIST SETOR ADMIN
  // GET /api/v1/setor-sampah/admin/list
  // ==========================================
  async getAdminList(
    appMakerId: number,
    status?: string,
    bulan?: string,
  ) {
    const where: any = {
      appMakerId,
    };

    if (status) {
      where.status = status;
    }

    if (bulan) {
      const [tahun, nomorBulan] =
        bulan.split('-').map(Number);

      const tanggalMulai = new Date(
        tahun,
        nomorBulan - 1,
        1,
      );

      const tanggalAkhir = new Date(
        tahun,
        nomorBulan,
        1,
      );

      where.tanggal = {
        gte: tanggalMulai,
        lt: tanggalAkhir,
      };
    }

    const setor =
      await this.prisma.setorsampah.findMany({
        where,
        orderBy: {
          tanggal: 'desc',
        },
        include: {
          nasabah: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          detailsetor: {
            include: {
              kategorisampah: true,
            },
          },
        },
      });

    return {
      statusCode: 200,
      success: true,
      message:
        'Data setor sampah berhasil diambil',
      data: setor,
    };
  }

  // ==========================================
  // DETAIL SETOR SAMPAH
  // GET /api/v1/setor-sampah/:id
  // ==========================================
  async getDetail(
    id: number,
    userId: number,
    appMakerId: number,
    role: string,
  ) {
    const setor =
      await this.prisma.setorsampah.findFirst({
        where: {
          id,
          appMakerId,
        },
        include: {
          nasabah: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          detailsetor: {
            include: {
              kategorisampah: true,
            },
          },
        },
      });

    if (!setor) {
      throw new NotFoundException(
        'Data setor sampah tidak ditemukan',
      );
    }

    if (
      role === 'NASABAH' &&
      setor.nasabah.userId !== userId
    ) {
      throw new NotFoundException(
        'Data setor sampah tidak ditemukan',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message:
        'Detail setor sampah berhasil diambil',
      data: setor,
    };
  }

  // ==========================================
  // VERIFIKASI SETOR SAMPAH
  // PUT /api/v1/setor-sampah/admin/verify/:id
  // ==========================================
  async verifySetor(
    id: number,
    dto: VerifySetorSampahDto,
    appMakerId: number,
  ) {
    const setor =
      await this.prisma.setorsampah.findFirst({
        where: {
          id,
          appMakerId,
        },
        include: {
          detailsetor: true,
        },
      });

    if (!setor) {
      throw new NotFoundException(
        'Data setor sampah tidak ditemukan',
      );
    }

    const updatedSetor =
      await this.prisma.$transaction(
        async (tx) => {
          // ==========================================
          // 1. UPDATE BERAT REAL
          // ==========================================
          if (
            dto.itemsReal &&
            dto.itemsReal.length > 0
          ) {
            for (const item of dto.itemsReal) {
              const detail =
                setor.detailsetor.find(
                  (detail) =>
                    detail.kategoriSampahId ===
                    item.kategoriSampahId,
                );

              if (!detail) {
                throw new NotFoundException(
                  'Detail kategori sampah tidak ditemukan',
                );
              }

              const kategori =
                await tx.kategorisampah.findFirst({
                  where: {
                    id: item.kategoriSampahId,
                    appMakerId,
                  },
                });

              if (!kategori) {
                throw new NotFoundException(
                  'Kategori sampah tidak ditemukan',
                );
              }

              const subtotalBayar =
                Math.round(
                  item.beratKgReal *
                    kategori.hargaPerKg,
                );

              const subtotalPoin =
                Math.round(
                  item.beratKgReal *
                    kategori.poinPerKg,
                );

              await tx.detailsetor.update({
                where: {
                  id: detail.id,
                },
                data: {
                  beratKgReal:
                    item.beratKgReal,
                  subtotalBayar,
                  subtotalPoin,
                },
              });
            }
          }

          // ==========================================
          // 2. AMBIL DETAIL TERBARU
          // ==========================================
          const detailTerbaru =
            await tx.detailsetor.findMany({
              where: {
                setorSampahId: setor.id,
              },
            });

          // ==========================================
          // 3. HITUNG TOTAL
          // ==========================================
          const totalBeratKg =
            detailTerbaru.reduce(
              (total, detail) =>
                total +
                Number(
                  detail.beratKgReal ??
                    detail.beratKgEstimasi,
                ),
              0,
            );

          const totalBayar =
            detailTerbaru.reduce(
              (total, detail) =>
                total +
                detail.subtotalBayar,
              0,
            );

          const totalPoin =
            detailTerbaru.reduce(
              (total, detail) =>
                total +
                detail.subtotalPoin,
              0,
            );

          // ==========================================
          // 4. CEK STATUS SEBELUMNYA
          // ==========================================
          const statusSebelumnya =
            setor.status;

          const poinBelumDiberikan =
            statusSebelumnya ===
            'menunggu_konfirmasi';

          const statusMenghasilkanPoin =
            dto.status === 'diverifikasi' ||
            dto.status === 'selesai';

          // ==========================================
          // 5. TAMBAHKAN POIN
          // ==========================================
          if (
            poinBelumDiberikan &&
            statusMenghasilkanPoin
          ) {
            await tx.nasabah.update({
              where: {
                id: setor.nasabahId,
              },
              data: {
                saldoPoin: {
                  increment: totalPoin,
                },
              },
            });
          }

          // ==========================================
          // 6. UPDATE SETOR
          // ==========================================
          return tx.setorsampah.update({
            where: {
              id: setor.id,
            },
            data: {
              status: dto.status as
                | 'diverifikasi'
                | 'ditolak'
                | 'selesai',
              catatanAdmin:
                dto.catatanAdmin,
              totalBeratKg,
              totalBayar,
              totalPoin,
            },
            include: {
              nasabah: true,
              detailsetor: {
                include: {
                  kategorisampah: true,
                },
              },
            },
          });
        },
      );

    return {
      statusCode: 200,
      success: true,
      message:
        'Setor sampah berhasil diverifikasi',
      data: updatedSetor,
    };
  }
}
