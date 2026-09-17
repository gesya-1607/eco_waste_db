import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // DASHBOARD SUMMARY NASABAH
  // ==========================================
  async getSummary(
    userId: number,
    appMakerId: number,
  ) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: {
        userId,
        appMakerId,
      },
    });

    if (!nasabah) {
      throw new Error(
        'Data nasabah tidak ditemukan',
      );
    }

    const totalSetor =
      await this.prisma.setorsampah.count({
        where: {
          nasabahId: nasabah.id,
          appMakerId,
        },
      });

    const totalPenukaran =
      await this.prisma.penukaranpoin.count({
        where: {
          nasabahId: nasabah.id,
          appMakerId,
        },
      });

    const setorSampah =
      await this.prisma.setorsampah.findMany({
        where: {
          nasabahId: nasabah.id,
          appMakerId,
        },
        select: {
          totalBeratKg: true,
          totalPoin: true,
          totalBayar: true,
        },
      });

    const totalBeratKg = setorSampah.reduce(
      (total, setor) =>
        total + Number(setor.totalBeratKg),
      0,
    );

    const totalPoinDiperoleh =
      setorSampah.reduce(
        (total, setor) =>
          total + setor.totalPoin,
        0,
      );

    const totalPendapatan =
      setorSampah.reduce(
        (total, setor) =>
          total + setor.totalBayar,
        0,
      );

    return {
      statusCode: 200,
      success: true,
      message:
        'Dashboard summary berhasil diambil',
      data: {
        saldoPoin: nasabah.saldoPoin,
        totalSetor,
        totalBeratKg,
        totalPoinDiperoleh,
        totalPendapatan,
        totalPenukaran,
      },
    };
  }

  // ==========================================
  // DASHBOARD STATS ADMIN / APP MAKER
  // ==========================================
  async getStats(appMakerId: number) {
    const totalNasabah =
      await this.prisma.nasabah.count({
        where: {
          appMakerId,
        },
      });

    const totalSetor =
      await this.prisma.setorsampah.count({
        where: {
          appMakerId,
        },
      });

    const totalKategori =
      await this.prisma.kategorisampah.count({
        where: {
          appMakerId,
        },
      });

    const totalHadiah =
      await this.prisma.hadiah.count({
        where: {
          appMakerId,
        },
      });

    const totalPenukaran =
      await this.prisma.penukaranpoin.count({
        where: {
          appMakerId,
        },
      });

    const setorSampah =
      await this.prisma.setorsampah.findMany({
        where: {
          appMakerId,
        },
        select: {
          totalBeratKg: true,
          totalPoin: true,
          totalBayar: true,
        },
      });

    const totalBeratKg = setorSampah.reduce(
      (total, setor) =>
        total + Number(setor.totalBeratKg),
      0,
    );

    const totalPoin =
      setorSampah.reduce(
        (total, setor) =>
          total + setor.totalPoin,
        0,
      );

    const totalBayar =
      setorSampah.reduce(
        (total, setor) =>
          total + setor.totalBayar,
        0,
      );

    return {
      statusCode: 200,
      success: true,
      message:
        'Dashboard stats berhasil diambil',
      data: {
        totalNasabah,
        totalSetor,
        totalKategori,
        totalHadiah,
        totalPenukaran,
        totalBeratKg,
        totalPoin,
        totalBayar,
      },
    };
  }
}
