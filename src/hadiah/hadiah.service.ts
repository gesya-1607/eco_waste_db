import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';

@Injectable()
export class HadiahService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // GET SEMUA HADIAH
  // GET /api/v1/hadiah
  // ==========================================
  async getHadiah(
    appMakerId: number,
  ) {
    const hadiah =
      await this.prisma.hadiah.findMany({
        where: {
          appMakerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      statusCode: 200,
      success: true,
      message: 'Data hadiah berhasil diambil',
      data: hadiah,
    };
  }

  // ==========================================
  // CREATE HADIAH
  // POST /api/v1/hadiah
  // ==========================================
  async createHadiah(
    dto: CreateHadiahDto,
    appMakerId: number,
    foto?: Express.Multer.File,
  ) {
    const hadiah =
      await this.prisma.hadiah.create({
        data: {
          appMakerId,

          namaHadiah:
            dto.namaHadiah,

          poinDibutuhkan:
            dto.poinDibutuhkan,

          stok:
            dto.stok,

          foto:
            foto ? foto.path : null,

          updatedAt: new Date(),
        },
      });

    return {
      statusCode: 201,
      success: true,
      message: 'Hadiah berhasil ditambahkan',
      data: hadiah,
    };
  }

  // ==========================================
  // GET DETAIL HADIAH
  // GET /api/v1/hadiah/:id
  // ==========================================
  async getHadiahById(
    id: number,
    appMakerId: number,
  ) {
    const hadiah =
      await this.prisma.hadiah.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!hadiah) {
      throw new NotFoundException(
        'Hadiah tidak ditemukan',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Detail hadiah berhasil diambil',
      data: hadiah,
    };
  }

  // ==========================================
  // UPDATE HADIAH
  // PUT /api/v1/hadiah/:id
  // ==========================================
  async updateHadiah(
    id: number,
    dto: UpdateHadiahDto,
    appMakerId: number,
    foto?: Express.Multer.File,
  ) {
    const hadiah =
      await this.prisma.hadiah.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!hadiah) {
      throw new NotFoundException(
        'Hadiah tidak ditemukan',
      );
    }

    const updatedHadiah =
      await this.prisma.hadiah.update({
        where: {
          id,
        },
        data: {
          namaHadiah:
            dto.namaHadiah,

          poinDibutuhkan:
            dto.poinDibutuhkan,

          stok:
            dto.stok,

          ...(foto
            ? {
                foto: foto.path,
              }
            : {}),
        },
      });

    return {
      statusCode: 200,
      success: true,
      message: 'Hadiah berhasil diperbarui',
      data: updatedHadiah,
    };
  }

  // ==========================================
  // DELETE HADIAH
  // DELETE /api/v1/hadiah/:id
  // ==========================================
  async deleteHadiah(
    id: number,
    appMakerId: number,
  ) {
    const hadiah =
      await this.prisma.hadiah.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!hadiah) {
      throw new NotFoundException(
        'Hadiah tidak ditemukan',
      );
    }

    await this.prisma.hadiah.delete({
      where: {
        id,
      },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Hadiah berhasil dihapus',
      data: null,
    };
  }
}
