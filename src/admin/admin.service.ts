import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // GET SEMUA NASABAH
  // ==========================================
  async getNasabah(appMakerId: number) {
    const nasabah = await this.prisma.nasabah.findMany({
      where: {
        appMakerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Data nasabah berhasil diambil',
      data: nasabah,
    };
  }

  // ==========================================
  // GET DETAIL NASABAH
  // ==========================================
  async getNasabahById(
    id: number,
    appMakerId: number,
  ) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: {
        id,
        appMakerId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!nasabah) {
      throw new UnauthorizedException(
        'Nasabah tidak ditemukan',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Detail nasabah berhasil diambil',
      data: nasabah,
    };
  }

  // ==========================================
  // CREATE NASABAH
  // ==========================================
  async createNasabah(
    dto: CreateNasabahDto,
    appMakerId: number,
    foto?: Express.Multer.File,
  ) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        appMakerId,
        username: dto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Username sudah terdaftar',
      );
    }

    const appMaker = await this.prisma.appmaker.findUnique({
      where: {
        id: appMakerId,
      },
    });

    if (!appMaker) {
      throw new UnauthorizedException(
        'App Maker tidak ditemukan',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = await this.prisma.user.create({
      data: {
        appMakerId,
        username: dto.username,
        password: hashedPassword,
        role: 'NASABAH',
        updatedAt: new Date(),
      },
    });

    const nasabah = await this.prisma.nasabah.create({
      data: {
        appMakerId,
        userId: user.id,
        namaNasabah: dto.namaNasabah,
        alamat: dto.alamat,
        telp: dto.telp,
        foto: foto ? foto.path : null,
        updatedAt: new Date(),
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Nasabah berhasil ditambahkan',
      data: {
        id: nasabah.id,
        username: user.username,
        namaNasabah: nasabah.namaNasabah,
        alamat: nasabah.alamat,
        telp: nasabah.telp,
        foto: nasabah.foto,
      },
    };
  }

  // ==========================================
  // UPDATE NASABAH
  // ==========================================
  async updateNasabah(
    id: number,
    dto: UpdateNasabahDto,
    appMakerId: number,
    foto?: Express.Multer.File,
  ) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: {
        id,
        appMakerId,
      },
    });

    if (!nasabah) {
      throw new UnauthorizedException(
        'Nasabah tidak ditemukan',
      );
    }

    const updatedNasabah =
      await this.prisma.nasabah.update({
        where: {
          id: nasabah.id,
        },
        data: {
          namaNasabah: dto.namaLengkap,
          telp: dto.noTelepon,
          alamat: dto.alamat,

          tanggalLahir: dto.tanggalLahir
            ? new Date(dto.tanggalLahir)
            : null,

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
      message: 'Data nasabah berhasil diperbarui',
      data: updatedNasabah,
    };
  }

  // ==========================================
  // DELETE NASABAH
  // ==========================================
  async deleteNasabah(
    id: number,
    appMakerId: number,
  ) {
    const nasabah = await this.prisma.nasabah.findFirst({
      where: {
        id,
        appMakerId,
      },
    });

    if (!nasabah) {
      throw new UnauthorizedException(
        'Nasabah tidak ditemukan',
      );
    }

    await this.prisma.nasabah.delete({
      where: {
        id: nasabah.id,
      },
    });

    await this.prisma.user.delete({
      where: {
        id: nasabah.userId,
      },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Nasabah berhasil dihapus',
      data: null,
    };
  }
}
