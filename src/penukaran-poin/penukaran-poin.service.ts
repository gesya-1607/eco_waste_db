import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePenukaranPoinDto } from './dto/create-penukaran-poin.dto';
import { UpdatePenukaranPoinDto } from './dto/update-penukaran-poin.dto';

@Injectable()
export class PenukaranPoinService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // TUKAR POIN
  // POST /api/v1/penukaran-poin/tukar
  // ==========================================
  async tukarPoin(
    dto: CreatePenukaranPoinDto,
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

    const hadiah =
      await this.prisma.hadiah.findFirst({
        where: {
          id: dto.hadiahId,
          appMakerId,
        },
      });

    if (!hadiah) {
      throw new NotFoundException(
        'Hadiah tidak ditemukan',
      );
    }

    if (hadiah.stok <= 0) {
      throw new BadRequestException(
        'Stok hadiah sudah habis',
      );
    }

    if (
      nasabah.saldoPoin <
      hadiah.poinDibutuhkan
    ) {
      throw new BadRequestException(
        'Saldo poin tidak mencukupi',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const kodePenukaran =
          `TUKAR-${Date.now()}`;

        await tx.nasabah.update({
          where: {
            id: nasabah.id,
          },
          data: {
            saldoPoin: {
              decrement:
                hadiah.poinDibutuhkan,
            },
          },
        });

        await tx.hadiah.update({
          where: {
            id: hadiah.id,
          },
          data: {
            stok: {
              decrement: 1,
            },
          },
        });

        const penukaran =
          await tx.penukaranpoin.create({
            data: {
              appMakerId,
              nasabahId: nasabah.id,
              hadiahId: hadiah.id,
              kodePenukaran,
              poinTerpakai:
                hadiah.poinDibutuhkan,
              status: 'diproses',
            },
            include: {
              hadiah: true,
              nasabah: true,
            },
          });

        return {
          statusCode: 201,
          success: true,
          message:
            'Penukaran poin berhasil',
          data: penukaran,
        };
      },
    );
  }

  // ==========================================
  // RIWAYAT PENUKARAN NASABAH
  // GET /api/v1/penukaran-poin/my-penukaran
  // ==========================================
  async getMyPenukaran(
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

    const penukaran =
      await this.prisma.penukaranpoin.findMany({
        where: {
          nasabahId: nasabah.id,
          appMakerId,
        },
        orderBy: {
          tanggal: 'desc',
        },
        include: {
          hadiah: true,
        },
      });

    return {
      statusCode: 200,
      success: true,
      message:
        'Riwayat penukaran berhasil diambil',
      data: penukaran,
    };
  }

  // ==========================================
  // LIST PENUKARAN ADMIN
  // GET /api/v1/penukaran-poin/admin/list
  // ==========================================
  async getAdminList(
    appMakerId: number,
  ) {
    const penukaran =
      await this.prisma.penukaranpoin.findMany({
        where: {
          appMakerId,
        },
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
          hadiah: true,
        },
      });

    return {
      statusCode: 200,
      success: true,
      message:
        'Data penukaran berhasil diambil',
      data: penukaran,
    };
  }

  // ==========================================
  // UPDATE STATUS PENUKARAN
  // PUT /api/v1/penukaran-poin/admin/status/:id
  // ==========================================
  async updateStatus(
    id: number,
    dto: UpdatePenukaranPoinDto,
    appMakerId: number,
  ) {
    const penukaran =
      await this.prisma.penukaranpoin.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!penukaran) {
      throw new NotFoundException(
        'Data penukaran tidak ditemukan',
      );
    }

    const updatedPenukaran =
      await this.prisma.penukaranpoin.update({
        where: {
          id: penukaran.id,
        },
        data: {
          status:
            dto.status as
              | 'diproses'
              | 'selesai'
              | 'ditolak',
        },
        include: {
          nasabah: true,
          hadiah: true,
        },
      });

    return {
      statusCode: 200,
      success: true,
      message:
        'Status penukaran berhasil diperbarui',
      data: updatedPenukaran,
    };
  }

  // ==========================================
  // NOTA PENUKARAN
  // GET /api/v1/penukaran-poin/nota/:id
  // ==========================================
  async getNota(
    id: number,
    userId: number,
    appMakerId: number,
    role: string,
  ) {
    const penukaran =
      await this.prisma.penukaranpoin.findFirst({
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
          hadiah: true,
        },
      });

    if (!penukaran) {
      throw new NotFoundException(
        'Data penukaran tidak ditemukan',
      );
    }

    if (
      role === 'NASABAH' &&
      penukaran.nasabah.userId !== userId
    ) {
      throw new BadRequestException(
        'Anda tidak memiliki akses ke nota ini',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message:
        'Nota penukaran berhasil diambil',
      data: penukaran,
    };
  }
}
