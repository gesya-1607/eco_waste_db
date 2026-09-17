import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RekapitulasiService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // REKAPITULASI BULANAN
  // GET /api/v1/rekapitulasi/bulanan
  // ==========================================
  async getBulanan(
    appMakerId: number,
    bulan: string,
  ) {
    if (!/^\d{4}-\d{2}$/.test(bulan)) {
      throw new BadRequestException(
        'Format bulan harus YYYY-MM',
      );
    }

    const [tahun, nomorBulan] = bulan
      .split('-')
      .map(Number);

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

    const setorSampah =
      await this.prisma.setorsampah.findMany({
        where: {
          appMakerId,
          tanggal: {
            gte: tanggalMulai,
            lt: tanggalAkhir,
          },
        },
        include: {
          nasabah: true,
          detailsetor: {
            include: {
              kategorisampah: true,
            },
          },
        },
        orderBy: {
          tanggal: 'asc',
        },
      });

    const penukaranPoin =
      await this.prisma.penukaranpoin.findMany({
        where: {
          appMakerId,
          tanggal: {
            gte: tanggalMulai,
            lt: tanggalAkhir,
          },
        },
        include: {
          nasabah: true,
          hadiah: true,
        },
        orderBy: {
          tanggal: 'asc',
        },
      });

    const totalSetor =
      setorSampah.length;

    const totalBeratKg =
      setorSampah.reduce(
        (total, setor) =>
          total +
          Number(setor.totalBeratKg),
        0,
      );

    const totalBayar =
      setorSampah.reduce(
        (total, setor) =>
          total + setor.totalBayar,
        0,
      );

    const totalPoin =
      setorSampah.reduce(
        (total, setor) =>
          total + setor.totalPoin,
        0,
      );

    const totalPenukaran =
      penukaranPoin.length;

    const totalPoinTerpakai =
      penukaranPoin.reduce(
        (total, penukaran) =>
          total +
          penukaran.poinTerpakai,
        0,
      );

    return {
      statusCode: 200,
      success: true,
      message:
        'Rekapitulasi bulanan berhasil diambil',
      data: {
        bulan,
        totalSetor,
        totalBeratKg,
        totalBayar,
        totalPoin,
        totalPenukaran,
        totalPoinTerpakai,
        setorSampah,
        penukaranPoin,
      },
    };
  }
}
