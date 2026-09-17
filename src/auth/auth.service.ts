import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterNasabahDto } from './dto/register-nasabah.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ==========================================
  // REGISTER NASABAH
  // ==========================================
  async registerNasabah(
    dto: RegisterNasabahDto,
    appKey: string,
    foto?: Express.Multer.File,
  ) {
    const appMaker = await this.prisma.appmaker.findUnique({
      where: {
        appKey,
      },
    });

    if (!appMaker) {
      throw new UnauthorizedException('App key tidak valid');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        appMakerId: appMaker.id,
        username: dto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Username sudah terdaftar',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = await this.prisma.user.create({
      data: {
        appMakerId: appMaker.id,
        username: dto.username,
        password: hashedPassword,
        role: 'NASABAH',
        updatedAt: new Date(),
      },
    });

    const nasabah = await this.prisma.nasabah.create({
      data: {
        appMakerId: appMaker.id,
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
      message: 'Nasabah berhasil didaftarkan',
      data: {
        id: nasabah.id,
        username: user.username,
        namaNasabah: nasabah.namaNasabah,
        alamat: nasabah.alamat,
        telp: nasabah.telp,
      },
    };
  }

  // ==========================================
  // REGISTER ADMIN
  // ==========================================
  async registerAdmin(
    dto: RegisterAdminDto,
    appKey: string,
  ) {
    const appMaker = await this.prisma.appmaker.findUnique({
      where: {
        appKey,
      },
    });

    if (!appMaker) {
      throw new UnauthorizedException(
        'App key tidak valid',
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        appMakerId: appMaker.id,
        username: dto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Username sudah terdaftar',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = await this.prisma.user.create({
      data: {
        appMakerId: appMaker.id,
        username: dto.username,
        password: hashedPassword,
        role: 'ADMIN',
        updatedAt: new Date(),
      },
    });

    const adminBank = await this.prisma.adminbank.create({
      data: {
        appMakerId: appMaker.id,
        userId: user.id,
        namaUnit: dto.namaUnit,
        namaPengelola: dto.namaPengelola,
        telp: dto.telp,
        updatedAt: new Date(),
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Admin berhasil didaftarkan',
      data: {
        id: adminBank.id,
        username: user.username,
        namaUnit: adminBank.namaUnit,
        namaPengelola: adminBank.namaPengelola,
        telp: adminBank.telp,
      },
    };
  }

  // ==========================================
  // LOGIN
  // ==========================================
  async login(
    dto: LoginUserDto,
    appKey: string,
  ) {
    const appMaker = await this.prisma.appmaker.findUnique({
      where: {
        appKey,
      },
    });

    if (!appMaker) {
      throw new UnauthorizedException(
        'App key tidak valid',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        appMakerId: appMaker.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Username atau password salah',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Username atau password salah',
      );
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      appMakerId: user.appMakerId,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      statusCode: 200,
      success: true,
      message: 'Login berhasil',
      data: {
        accessToken,
        tokenType: 'Bearer',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    };
  }

  // ==========================================
  // ME
  // ==========================================
  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        nasabah: true,
        adminbank: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User tidak ditemukan',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Data user berhasil diambil',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        nasabah: user.nasabah,
        adminBank: user.adminbank,
      },
    };
  }
}
