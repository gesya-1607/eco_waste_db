import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { SetorSampahService } from './setor-sampah.service';

import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto';

import { VerifySetorSampahDto } from './dto/verify-setor-sampah.dto';

import { AppKeyGuard } from '../auth/guards/app-key.guard';

import { JwtGuard } from '../auth/guards/jwt.guard';

import { AdminGuard } from '../admin/guards/admin.guard';

import { NasabahGuard } from '../auth/guards/nasabah/nasabah.guard';

@ApiTags('Setor Sampah')
@Controller('api/v1/setor-sampah')
export class SetorSampahController {
  constructor(
    private readonly setorSampahService: SetorSampahService,
  ) {}

  // ==========================================
  // PENGAJUAN SETOR SAMPAH
  // POST /api/v1/setor-sampah/pengajuan
  // NASABAH
  // ==========================================
  @Post('pengajuan')
  @UseGuards(AppKeyGuard, JwtGuard, NasabahGuard)
  @ApiOperation({
    summary: 'Pengajuan Setor Sampah',
    description:
      'Nasabah mengajukan setoran sampah dengan satu atau beberapa kategori sampah.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiBody({
    type: CreateSetorSampahDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Pengajuan setor sampah berhasil dibuat.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Nasabah.',
  })
  createPengajuan(
    @Body() dto: CreateSetorSampahDto,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.setorSampahService.createPengajuan(
      dto,
      req.user.sub,
      req.user.appMakerId,
    );
  }

  // ==========================================
  // RIWAYAT SETOR NASABAH
  // GET /api/v1/setor-sampah/my-setor
  // ==========================================
  @Get('my-setor')
  @UseGuards(AppKeyGuard, JwtGuard, NasabahGuard)
  @ApiOperation({
    summary: 'Riwayat Setor Sampah Nasabah',
    description:
      'Mengambil riwayat setoran sampah milik nasabah yang sedang login.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiQuery({
    name: 'bulan',
    required: false,
    description: 'Filter berdasarkan bulan dengan format YYYY-MM.',
    example: '2026-09',
  })
  @ApiResponse({
    status: 200,
    description: 'Riwayat setor sampah berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Nasabah.',
  })
  getMySetor(
    @Query('bulan') bulan: string,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.setorSampahService.getMySetor(
      req.user.sub,
      req.user.appMakerId,
      bulan,
    );
  }

  // ==========================================
  // LIST SETOR SAMPAH ADMIN
  // GET /api/v1/setor-sampah/admin/list
  // ==========================================
  @Get('admin/list')
  @UseGuards(AppKeyGuard, JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'List Setor Sampah Admin',
    description:
      'Admin melihat seluruh pengajuan setor sampah pada App Maker.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter berdasarkan status setoran.',
    example: 'menunggu_konfirmasi',
  })
  @ApiQuery({
    name: 'bulan',
    required: false,
    description: 'Filter berdasarkan bulan dengan format YYYY-MM.',
    example: '2026-09',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar setor sampah berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Admin.',
  })
  getAdminList(
    @Query('status') status: string,
    @Query('bulan') bulan: string,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.setorSampahService.getAdminList(
      req.user.appMakerId,
      status,
      bulan,
    );
  }

  // ==========================================
  // DETAIL SETOR SAMPAH
  // GET /api/v1/setor-sampah/:id
  // ==========================================
  @Get(':id')
  @UseGuards(AppKeyGuard, JwtGuard)
  @ApiOperation({
    summary: 'Detail Setor Sampah',
    description:
      'Mengambil detail setoran sampah berdasarkan ID. Dapat diakses Nasabah pemilik atau Admin.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'id',
    description: 'ID setor sampah',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detail setor sampah berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Setor sampah tidak ditemukan.',
  })
  getDetail(
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
    return this.setorSampahService.getDetail(
      id,
      req.user.sub,
      req.user.appMakerId,
      req.user.role,
    );
  }

  // ==========================================
  // VERIFIKASI SETOR SAMPAH ADMIN
  // PUT /api/v1/setor-sampah/admin/verify/:id
  // ==========================================
  @Put('admin/verify/:id')
  @UseGuards(AppKeyGuard, JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'Verifikasi Setor Sampah',
    description:
      'Admin melakukan verifikasi setoran, mengubah berat aktual, dan menentukan status setoran.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'id',
    description: 'ID setor sampah',
    example: 1,
  })
  @ApiBody({
    type: VerifySetorSampahDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Setor sampah berhasil diverifikasi.',
  })
  @ApiResponse({
    status: 400,
    description: 'Data verifikasi tidak valid.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Akses hanya untuk Admin.',
  })
  @ApiResponse({
    status: 404,
    description: 'Setor sampah tidak ditemukan.',
  })
  verifySetor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifySetorSampahDto,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.setorSampahService.verifySetor(
      id,
      dto,
      req.user.appMakerId,
    );
  }
}
