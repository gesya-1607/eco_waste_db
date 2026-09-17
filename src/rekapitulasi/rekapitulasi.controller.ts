import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { RekapitulasiService } from './rekapitulasi.service';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@ApiTags('Rekapitulasi')
@Controller('api/v1/rekapitulasi')
@UseGuards(AppKeyGuard, JwtGuard, AdminGuard)
@ApiSecurity('app-key')
@ApiSecurity('access-token')
export class RekapitulasiController {
  constructor(
    private readonly rekapitulasiService: RekapitulasiService,
  ) {}

  // ==========================================
  // REKAPITULASI BULANAN
  // GET /api/v1/rekapitulasi/bulanan?bulan=2026-09
  // ==========================================
  @Get('bulanan')
  @ApiOperation({
    summary: 'Rekapitulasi Bulanan',
    description:
      'Mengambil rekapitulasi transaksi setor sampah dan penukaran poin berdasarkan bulan.',
  })
  @ApiQuery({
    name: 'bulan',
    required: true,
    description: 'Bulan yang ingin direkap dengan format YYYY-MM.',
    example: '2026-09',
  })
  @ApiResponse({
    status: 200,
    description:
      'Rekapitulasi bulanan berhasil diambil.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Format bulan tidak valid. Gunakan format YYYY-MM.',
  })
  @ApiResponse({
    status: 401,
    description:
      'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Akses hanya untuk Admin.',
  })
  getBulanan(
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
    return this.rekapitulasiService.getBulanan(
      req.user.appMakerId,
      bulan,
    );
  }
}
