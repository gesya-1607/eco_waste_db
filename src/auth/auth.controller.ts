import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import type { Request } from 'express';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterNasabahDto } from './dto/register-nasabah.dto';
import { AppKeyGuard } from './guards/app-key.guard';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // ==========================================
  // REGISTER NASABAH
  // ==========================================
  @Post('nasabah/register')
  @UseGuards(AppKeyGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      dest: './uploads',
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              'Format foto harus JPG, PNG, atau WebP',
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({
    summary: 'Register Nasabah',
    description:
      'Mendaftarkan akun nasabah baru pada aplikasi Bank Sampah.',
  })
  @ApiSecurity('app-key')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'nasabah01',
        },
        password: {
          type: 'string',
          example: '12345678',
        },
        namaNasabah: {
          type: 'string',
          example: 'Budi Santoso',
        },
        alamat: {
          type: 'string',
          example: 'Jl. Merdeka No. 10',
        },
        telp: {
          type: 'string',
          example: '081234567890',
        },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'username',
        'password',
        'namaNasabah',
        'alamat',
        'telp',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Nasabah berhasil didaftarkan.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username sudah terdaftar.',
  })
  registerNasabah(
    @Body() dto: RegisterNasabahDto,
    @Headers('x-app-key') appKey: string,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    return this.authService.registerNasabah(
      dto,
      appKey,
      foto,
    );
  }

  // ==========================================
  // REGISTER ADMIN
  // ==========================================
  @Post('admin/register')
  @UseGuards(AppKeyGuard)
  @ApiOperation({
    summary: 'Register Admin',
    description:
      'Mendaftarkan akun admin Bank Sampah baru.',
  })
  @ApiSecurity('app-key')
  @ApiBody({
    type: RegisterAdminDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Admin berhasil didaftarkan.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username sudah terdaftar.',
  })
  registerAdmin(
    @Body() dto: RegisterAdminDto,
    @Headers('x-app-key') appKey: string,
  ) {
    return this.authService.registerAdmin(
      dto,
      appKey,
    );
  }

  // ==========================================
  // LOGIN
  // ==========================================
  @Post('login')
  @UseGuards(AppKeyGuard)
  @ApiOperation({
    summary: 'Login User',
    description:
      'Login sebagai Admin atau Nasabah menggunakan username dan password.',
  })
  @ApiSecurity('app-key')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Login berhasil dan mendapatkan JWT.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Username atau password salah.',
  })
  login(
    @Body() dto: LoginUserDto,
    @Headers('x-app-key') appKey: string,
  ) {
    return this.authService.login(
      dto,
      appKey,
    );
  }

  // ==========================================
  // GET ME
  // ==========================================
  @Get('me')
  @UseGuards(AppKeyGuard, JwtGuard)
  @ApiOperation({
    summary: 'Get Current User',
    description:
      'Mengambil data user yang sedang login.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description:
      'Data user berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description:
      'App Key atau JWT tidak valid.',
  })
  me(
    @Req()
    req: Request & {
      user: {
        sub: number;
      };
    },
  ) {
    const user = req.user;

    return this.authService.me(user.sub);
  }
}
