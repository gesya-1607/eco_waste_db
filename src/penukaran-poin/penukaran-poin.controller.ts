import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { PenukaranPoinService } from './penukaran-poin.service';

import { CreatePenukaranPoinDto } from './dto/create-penukaran-poin.dto';
import { UpdatePenukaranPoinDto } from './dto/update-penukaran-poin.dto';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@ApiTags('Penukaran Poin')
@Controller('api/v1/penukaran-poin')
@UseGuards(AppKeyGuard, JwtGuard)
@ApiSecurity('app-key')
@ApiSecurity('access-token')
export class PenukaranPoinController {
  constructor(
    private readonly penukaranPoinService: PenukaranPoinService,
  ) {}

  // ==========================================
  // TUKAR POIN
  // POST /api/v1/penukaran-poin/tukar
  // NASABAH
  // ==========================================
  @Post('tukar')
  @ApiOperation({
    summary: 'Tukar Poin',
    description:
      'Nasabah menukarkan poin dengan hadiah yang tersedia.',
  })
  @ApiBody({
    type: CreatePenukaranPoinDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Penukaran poin berhasil dibuat.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Poin tidak mencukupi atau stok hadiah tidak tersedia.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  tukarPoin(
    @Body() dto: CreatePenukaranPoinDto,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.penukaranPoinService.tukarPoin(
      dto,
      req.user.sub,
      req.user.appMakerId,
    );
  }

  // ==========================================
  // RIWAYAT PENUKARAN NASABAH
  // GET /api/v1/penukaran-poin/my-penukaran
  // NASABAH
  // ==========================================
  @Get('my-penukaran')
  @ApiOperation({
    summary: 'Riwayat Penukaran Nasabah',
    description:
      'Mengambil seluruh riwayat penukaran poin milik nasabah yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Riwayat penukaran berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  getMyPenukaran(
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.penukaranPoinService.getMyPenukaran(
      req.user.sub,
      req.user.appMakerId,
    );
  }

  // ==========================================
  // LIST PENUKARAN ADMIN
  // GET /api/v1/penukaran-poin/admin/list
  // ADMIN
  // ==========================================
  @Get('admin/list')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'List Penukaran Admin',
    description:
      'Admin melihat seluruh transaksi penukaran poin.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Daftar penukaran berhasil diambil.',
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
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.penukaranPoinService.getAdminList(
      req.user.appMakerId,
    );
  }

  // ==========================================
  // UPDATE STATUS PENUKARAN
  // PUT /api/v1/penukaran-poin/admin/status/:id
  // ADMIN
  // ==========================================
  @Put('admin/status/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Update Status Penukaran',
    description:
      'Admin mengubah status transaksi penukaran poin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID penukaran poin',
    example: 1,
  })
  @ApiBody({
    type: UpdatePenukaranPoinDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Status penukaran berhasil diperbarui.',
  })
  @ApiResponse({
    status: 400,
    description: 'Status tidak valid.',
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
    description:
      'Data penukaran tidak ditemukan.',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePenukaranPoinDto,
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.penukaranPoinService.updateStatus(
      id,
      dto,
      req.user.appMakerId,
    );
  }

  // ==========================================
  // NOTA PENUKARAN
  // GET /api/v1/penukaran-poin/nota/:id
  // NASABAH / ADMIN
  // ==========================================
  @Get('nota/:id')
  @ApiOperation({
    summary: 'Nota Penukaran',
    description:
      'Mengambil nota transaksi penukaran poin. Dapat diakses oleh Nasabah pemilik atau Admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID penukaran poin',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Nota penukaran berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Data penukaran tidak ditemukan.',
  })
  getNota(
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
    return this.penukaranPoinService.getNota(
      id,
      req.user.sub,
      req.user.appMakerId,
      req.user.role,
    );
  }
}
