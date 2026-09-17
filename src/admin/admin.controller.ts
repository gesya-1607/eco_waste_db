import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';

@ApiTags('Admin - Nasabah')
@Controller('api/v1/admin')
@UseGuards(AppKeyGuard, JwtGuard, AdminGuard)
@ApiSecurity('app-key')
@ApiSecurity('access-token')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // ==========================================
  // GET SEMUA NASABAH
  // GET /api/v1/admin/nasabah
  // ==========================================
  @Get('nasabah')
  @ApiOperation({
    summary: 'Get Semua Nasabah',
    description:
      'Mengambil seluruh data nasabah yang terdaftar pada App Maker.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data nasabah berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Admin.',
  })
  getNasabah(
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.adminService.getNasabah(
      req.user.appMakerId,
    );
  }

  // ==========================================
  // GET DETAIL NASABAH
  // GET /api/v1/admin/nasabah/:id
  // ==========================================
  @Get('nasabah/:id')
  @ApiOperation({
    summary: 'Get Detail Nasabah',
    description:
      'Mengambil detail satu nasabah berdasarkan ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID Nasabah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detail nasabah berhasil diambil.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nasabah tidak ditemukan.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Admin.',
  })
  getNasabahById(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.adminService.getNasabahById(
      id,
      req.user.appMakerId,
    );
  }

  // ==========================================
  // CREATE NASABAH
  // POST /api/v1/admin/nasabah
  // ==========================================
  @Post('nasabah')
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
    summary: 'Create Nasabah',
    description:
      'Menambahkan nasabah baru oleh Admin.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'nasabah02',
        },
        password: {
          type: 'string',
          example: '12345678',
        },
        namaNasabah: {
          type: 'string',
          example: 'Siti Aminah',
        },
        alamat: {
          type: 'string',
          example: 'Jl. Diponegoro No. 20',
        },
        telp: {
          type: 'string',
          example: '081234567891',
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
    description: 'Nasabah berhasil ditambahkan.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username sudah terdaftar.',
  })
  createNasabah(
    @Body() dto: CreateNasabahDto,

    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },

    @UploadedFile()
    foto: Express.Multer.File,
  ) {
    return this.adminService.createNasabah(
      dto,
      req.user.appMakerId,
      foto,
    );
  }

  // ==========================================
  // UPDATE NASABAH
  // PUT /api/v1/admin/nasabah/:id
  // ==========================================
  @Put('nasabah/:id')
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
    summary: 'Update Nasabah',
    description:
      'Mengubah data nasabah berdasarkan ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID Nasabah',
    example: 1,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        namaLengkap: {
          type: 'string',
          example: 'Siti Aminah Updated',
        },
        noTelepon: {
          type: 'string',
          example: '081234567899',
        },
        alamat: {
          type: 'string',
          example: 'Jl. Baru No. 25',
        },
        tanggalLahir: {
          type: 'string',
          example: '2008-05-15',
        },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Nasabah berhasil diperbarui.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nasabah tidak ditemukan.',
  })
  updateNasabah(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: UpdateNasabahDto,

    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },

    @UploadedFile()
    foto: Express.Multer.File,
  ) {
    return this.adminService.updateNasabah(
      id,
      dto,
      req.user.appMakerId,
      foto,
    );
  }

  // ==========================================
  // DELETE NASABAH
  // DELETE /api/v1/admin/nasabah/:id
  // ==========================================
  @Delete('nasabah/:id')
  @ApiOperation({
    summary: 'Delete Nasabah',
    description:
      'Menghapus data nasabah berdasarkan ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID Nasabah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Nasabah berhasil dihapus.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nasabah tidak ditemukan.',
  })
  deleteNasabah(
    @Param('id', ParseIntPipe) id: number,

    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.adminService.deleteNasabah(
      id,
      req.user.appMakerId,
    );
  }
}
