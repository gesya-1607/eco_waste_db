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

import { HadiahService } from './hadiah.service';

import { CreateHadiahDto } from './dto/create-hadiah.dto';
import { UpdateHadiahDto } from './dto/update-hadiah.dto';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@ApiTags('Hadiah')
@Controller('api/v1/hadiah')
@UseGuards(AppKeyGuard)
@ApiSecurity('app-key')
export class HadiahController {
  constructor(
    private readonly hadiahService: HadiahService,
  ) {}

  // ==========================================
  // GET SEMUA HADIAH
  // GET /api/v1/hadiah
  // ==========================================
  @Get()
  @ApiOperation({
    summary: 'Get Semua Hadiah',
    description:
      'Mengambil seluruh daftar hadiah yang tersedia.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data hadiah berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key tidak valid.',
  })
  getHadiah(
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.hadiahService.getHadiah(
      req.appMaker.id,
    );
  }

  // ==========================================
  // CREATE HADIAH
  // POST /api/v1/hadiah
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
    summary: 'Create Hadiah',
    description:
      'Menambahkan hadiah baru. Hanya dapat dilakukan oleh Admin.',
  })
  @ApiSecurity('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        namaHadiah: {
          type: 'string',
          example: 'Tumbler',
        },
        poinDibutuhkan: {
          type: 'integer',
          example: 100,
        },
        stok: {
          type: 'integer',
          example: 10,
        },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'namaHadiah',
        'poinDibutuhkan',
        'stok',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Hadiah berhasil dibuat.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Admin.',
  })
  createHadiah(
    @Body() dto: CreateHadiahDto,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
    @UploadedFile()
    foto: Express.Multer.File,
  ) {
    return this.hadiahService.createHadiah(
      dto,
      req.appMaker.id,
      foto,
    );
  }

  // ==========================================
  // GET DETAIL HADIAH
  // GET /api/v1/hadiah/:id
  // ==========================================
  @Get(':id')
  @ApiOperation({
    summary: 'Get Detail Hadiah',
    description:
      'Mengambil detail hadiah berdasarkan ID.',
  })
  @ApiSecurity('app-key')
  @ApiParam({
    name: 'id',
    description: 'ID hadiah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detail hadiah berhasil diambil.',
  })
  @ApiResponse({
    status: 404,
    description: 'Hadiah tidak ditemukan.',
  })
  getHadiahById(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.hadiahService.getHadiahById(
      id,
      req.appMaker.id,
    );
  }

  // ==========================================
  // UPDATE HADIAH
  // PUT /api/v1/hadiah/:id
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
    summary: 'Update Hadiah',
    description:
      'Mengubah data hadiah berdasarkan ID. Hanya dapat dilakukan oleh Admin.',
  })
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'id',
    description: 'ID hadiah',
    example: 1,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        namaHadiah: {
          type: 'string',
          example: 'Tumbler Eco',
        },
        poinDibutuhkan: {
          type: 'integer',
          example: 150,
        },
        stok: {
          type: 'integer',
          example: 20,
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
    description: 'Hadiah berhasil diperbarui.',
  })
  @ApiResponse({
    status: 404,
    description: 'Hadiah tidak ditemukan.',
  })
  updateHadiah(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHadiahDto,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
    @UploadedFile()
    foto: Express.Multer.File,
  ) {
    return this.hadiahService.updateHadiah(
      id,
      dto,
      req.appMaker.id,
      foto,
    );
  }

  // ==========================================
  // DELETE HADIAH
  // DELETE /api/v1/hadiah/:id
  // ADMIN
  // ==========================================
  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'Delete Hadiah',
    description:
      'Menghapus hadiah berdasarkan ID. Hanya dapat dilakukan oleh Admin.',
  })
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'id',
    description: 'ID hadiah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Hadiah berhasil dihapus.',
  })
  @ApiResponse({
    status: 404,
    description: 'Hadiah tidak ditemukan.',
  })
  deleteHadiah(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.hadiahService.deleteHadiah(
      id,
      req.appMaker.id,
    );
  }
}
