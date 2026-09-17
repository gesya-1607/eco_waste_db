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

import { KategoriSampahService } from './kategori-sampah.service';

import { CreateKategoriSampahDto } from './dto/create-kategori-sampah.dto';
import { UpdateKategoriSampahDto } from './dto/update-kategori-sampah.dto';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@ApiTags('Kategori Sampah')
@Controller('api/v1/kategori-sampah')
@UseGuards(AppKeyGuard)
@ApiSecurity('app-key')
export class KategoriSampahController {
  constructor(
    private readonly kategoriSampahService: KategoriSampahService,
  ) {}

  // ==========================================
  // GET SEMUA KATEGORI SAMPAH
  // GET /api/v1/kategori-sampah
  // ==========================================
  @Get()
  @ApiOperation({
    summary: 'Get Semua Kategori Sampah',
    description:
      'Mengambil seluruh kategori sampah yang tersedia.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data kategori sampah berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key tidak valid.',
  })
  getKategoriSampah(
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.kategoriSampahService.getKategoriSampah(
      req.appMaker.id,
    );
  }

  // ==========================================
  // CREATE KATEGORI SAMPAH
  // POST /api/v1/kategori-sampah
  // ADMIN
  // ==========================================
  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      dest: './uploads',
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (
          allowedTypes.includes(
            file.mimetype,
          )
        ) {
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
    summary: 'Create Kategori Sampah',
    description:
      'Menambahkan kategori sampah baru. Hanya dapat dilakukan oleh Admin.',
  })
  @ApiSecurity('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        namaKategori: {
          type: 'string',
          example: 'Plastik',
        },
        hargaPerKg: {
          type: 'number',
          example: 5000,
        },
        poinPerKg: {
          type: 'number',
          example: 10,
        },
        jenis: {
          type: 'string',
          enum: [
            'plastik',
            'kertas',
            'logam',
            'kaca',
          ],
          example: 'plastik',
        },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'namaKategori',
        'hargaPerKg',
        'poinPerKg',
        'jenis',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Kategori sampah berhasil dibuat.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Admin.',
  })
  createKategoriSampah(
    @Body() dto: CreateKategoriSampahDto,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
    @UploadedFile()
    foto: Express.Multer.File,
  ) {
    return this.kategoriSampahService.createKategoriSampah(
      dto,
      req.appMaker.id,
      foto,
    );
  }

  // ==========================================
  // GET DETAIL KATEGORI SAMPAH
  // GET /api/v1/kategori-sampah/:id
  // ==========================================
  @Get(':id')
  @ApiOperation({
    summary: 'Get Detail Kategori Sampah',
    description:
      'Mengambil detail kategori sampah berdasarkan ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID kategori sampah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Detail kategori sampah berhasil diambil.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Kategori sampah tidak ditemukan.',
  })
  getKategoriSampahById(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.kategoriSampahService.getKategoriSampahById(
      id,
      req.appMaker.id,
    );
  }

  // ==========================================
  // UPDATE KATEGORI SAMPAH
  // PUT /api/v1/kategori-sampah/:id
  // ADMIN
  // ==========================================
  @Put(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      dest: './uploads',
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (
          allowedTypes.includes(
            file.mimetype,
          )
        ) {
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
    summary: 'Update Kategori Sampah',
    description:
      'Mengubah data kategori sampah berdasarkan ID. Hanya dapat dilakukan oleh Admin.',
  })
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'id',
    description: 'ID kategori sampah',
    example: 1,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        namaKategori: {
          type: 'string',
          example: 'Plastik PET',
        },
        hargaPerKg: {
          type: 'number',
          example: 5500,
        },
        poinPerKg: {
          type: 'number',
          example: 11,
        },
        jenis: {
          type: 'string',
          enum: [
            'plastik',
            'kertas',
            'logam',
            'kaca',
          ],
          example: 'plastik',
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
    description:
      'Kategori sampah berhasil diperbarui.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Kategori sampah tidak ditemukan.',
  })
  updateKategoriSampah(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKategoriSampahDto,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
    @UploadedFile()
    foto: Express.Multer.File,
  ) {
    return this.kategoriSampahService.updateKategoriSampah(
      id,
      dto,
      req.appMaker.id,
      foto,
    );
  }

  // ==========================================
  // DELETE KATEGORI SAMPAH
  // DELETE /api/v1/kategori-sampah/:id
  // ADMIN
  // ==========================================
  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'Delete Kategori Sampah',
    description:
      'Menghapus kategori sampah berdasarkan ID. Hanya dapat dilakukan oleh Admin.',
  })
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'id',
    description: 'ID kategori sampah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Kategori sampah berhasil dihapus.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Kategori sampah tidak ditemukan.',
  })
  deleteKategoriSampah(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.kategoriSampahService.deleteKategoriSampah(
      id,
      req.appMaker.id,
    );
  }
}
