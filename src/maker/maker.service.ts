import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class MakerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterAppMakerDto) {
    const existingMaker = await this.prisma.appmaker.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingMaker) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const appKey = randomBytes(32).toString('hex');

    const maker = await this.prisma.appmaker.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        namaSiswa: dto.namaSiswa,
        kelas: dto.kelas,
        namaApp: dto.namaApp,
        appKey,
        updatedAt: new Date(),
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'App Maker berhasil didaftarkan',
      data: {
        id: maker.id,
        email: maker.email,
        namaSiswa: maker.namaSiswa,
        kelas: maker.kelas,
        namaApp: maker.namaApp,
        appKey: maker.appKey,
      },
    };
  }

  async login(dto: LoginAppMakerDto) {
    const maker = await this.prisma.appmaker.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!maker) {
      throw new ConflictException(
        'Email atau password salah',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      maker.password,
    );

    if (!passwordValid) {
      throw new ConflictException(
        'Email atau password salah',
      );
    }

    const payload = {
      sub: maker.id,
      email: maker.email,
      type: 'APP_MAKER',
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      statusCode: 200,
      success: true,
      message: 'Login berhasil',
      data: {
        id: maker.id,
        email: maker.email,
        namaSiswa: maker.namaSiswa,
        kelas: maker.kelas,
        namaApp: maker.namaApp,
        appKey: maker.appKey,
        accessToken,
        tokenType: 'Bearer',
      },
    };
  }

  async profile(makerId: number) {
    const maker = await this.prisma.appmaker.findUnique({
      where: {
        id: makerId,
      },
    });

    if (!maker) {
      throw new ConflictException(
        'App Maker tidak ditemukan',
      );
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Profile App Maker berhasil diambil',
      data: {
        id: maker.id,
        email: maker.email,
        namaSiswa: maker.namaSiswa,
        kelas: maker.kelas,
        namaApp: maker.namaApp,
        appKey: maker.appKey,
      },
    };
  }

  async checkKey(appKey: string) {
    const maker = await this.prisma.appmaker.findUnique({
      where: {
        appKey,
      },
    });

    if (!maker) {
      return {
        statusCode: 401,
        success: false,
        message: 'App key tidak valid',
        data: null,
      };
    }

    return {
      statusCode: 200,
      success: true,
      message: 'App key valid',
      data: {
        valid: true,
        appKey: maker.appKey,
        namaApp: maker.namaApp,
      },
    };
  }
}
