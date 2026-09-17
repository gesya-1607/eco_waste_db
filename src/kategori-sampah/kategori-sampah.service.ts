import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { kategorisampah_jenis } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateKategoriSampahDto } from './dto/create-kategori-sampah.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori-sampah.dto';

@Injectable()
export class KategoriSampahService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // GET SEMUA KATEGORI SAMPAH
  // GET /api/v1/kategori-sampah
  // ==========================================
  async getKategoriSampah(
    appMakerId: number,
  ) {
    const kategori =
      await this.prisma.kategorisampah.findMany({
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
      message:
        'Data kategori sampah berhasil diambil',
      data: kategori,
    };
  }

  // ==========================================
  // CREATE KATEGORI SAMPAH
  // POST /api/v1/kategori-sampah
  // ==========================================
  async createKategoriSampah(
    dto: CreateKategoriSampahDto,
    appMakerId: number,
    foto?: Express.Multer.File,
  ) {
    const kategori =
      await this.prisma.kategorisampah.create({
        data: {
          appMakerId,

          namaKategori:
            dto.namaKategori,

          hargaPerKg:
            dto.hargaPerKg,

          poinPerKg:
            dto.poinPerKg,

          jenis:
            dto.jenis as kategorisampah_jenis,

          foto:
            foto ? foto.path : null,

          updatedAt: new Date(),
        },
      });

    return {
      statusCode: 201,
      success: true,
      message:
        'Kategori sampah berhasil ditambahkan',
      data: kategori,
    };
  }

  // ==========================================
  // GET DETAIL KATEGORI SAMPAH
  // GET /api/v1/kategori-sampah/:id
  // ==========================================
  async getKategoriSampahById(
    id: number,
    appMakerId: number,
  ) {
    const kategori =
      await this.prisma.kategorisampah.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!kategori) {
      throw new NotFoundException(
        'Kategori sampah tidak ditemukan',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message:
        'Detail kategori sampah berhasil diambil',
      data: kategori,
    };
  }

  // ==========================================
  // UPDATE KATEGORI SAMPAH
  // PUT /api/v1/kategori-sampah/:id
  // ==========================================
  async updateKategoriSampah(
    id: number,
    dto: UpdateKategoriSampahDto,
    appMakerId: number,
    foto?: Express.Multer.File,
  ) {
    const kategori =
      await this.prisma.kategorisampah.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!kategori) {
      throw new NotFoundException(
        'Kategori sampah tidak ditemukan',
      );
    }

    const updatedKategori =
      await this.prisma.kategorisampah.update({
        where: {
          id,
        },
        data: {
          namaKategori:
            dto.namaKategori,

          hargaPerKg:
            dto.hargaPerKg,

          poinPerKg:
            dto.poinPerKg,

          jenis:
            dto.jenis as kategorisampah_jenis,

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
      message:
        'Kategori sampah berhasil diperbarui',
      data: updatedKategori,
    };
  }

  // ==========================================
  // DELETE KATEGORI SAMPAH
  // DELETE /api/v1/kategori-sampah/:id
  // ==========================================
  async deleteKategoriSampah(
    id: number,
    appMakerId: number,
  ) {
    const kategori =
      await this.prisma.kategorisampah.findFirst({
        where: {
          id,
          appMakerId,
        },
      });

    if (!kategori) {
      throw new NotFoundException(
        'Kategori sampah tidak ditemukan',
      );
    }

    await this.prisma.kategorisampah.delete({
      where: {
        id,
      },
    });

    return {
      statusCode: 200,
      success: true,
      message:
        'Kategori sampah berhasil dihapus',
      data: null,
    };
  }
}
