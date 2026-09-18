import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { NasabahGuard } from '../auth/guards/nasabah/nasabah.guard';

@ApiTags('Dashboard')
@Controller('api/v1/dashboard')
@UseGuards(AppKeyGuard, JwtGuard)
@ApiSecurity('app-key')
@ApiSecurity('access-token')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  // ==========================================
  // DASHBOARD SUMMARY
  // GET /api/v1/dashboard/summary
  // NASABAH
  // ==========================================

  @Get('summary')
  @UseGuards(NasabahGuard)
  @ApiOperation({
    summary: 'Dashboard Summary Nasabah',
    description:
      'Mengambil ringkasan dashboard milik nasabah yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Summary dashboard berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description:
      'App Key atau JWT tidak valid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Endpoint ini hanya dapat diakses menggunakan token Nasabah.',
  })
  getSummary(
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.dashboardService.getSummary(
      req.user.sub,
      req.user.appMakerId,
    );
  }

  // ==========================================
  // DASHBOARD STATS
  // GET /api/v1/dashboard/stats
  // ADMIN
  // ==========================================

  @Get('stats')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Dashboard Stats Admin',
    description:
      'Mengambil statistik keseluruhan aplikasi Bank Sampah untuk Admin.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Statistik dashboard berhasil diambil.',
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
  getStats(
    @Req()
    req: Request & {
      user: {
        sub: number;
        appMakerId: number;
        role: string;
      };
    },
  ) {
    return this.dashboardService.getStats(
      req.user.appMakerId,
    );
  }
}
