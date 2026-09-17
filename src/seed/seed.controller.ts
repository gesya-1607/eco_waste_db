import {
  Controller,
  Post,
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

import { SeedService } from './seed.service';

import { AppKeyGuard } from '../auth/guards/app-key.guard';

@ApiTags('Seed')
@Controller('api/v1/seed')
@UseGuards(AppKeyGuard)
@ApiSecurity('app-key')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
  ) {}

  // ==========================================
  // SEED DATA
  // POST /api/v1/seed
  // ==========================================
  @Post()
  @ApiOperation({
    summary: 'Seed Data',
    description:
      'Membuat data awal/sample untuk App Maker yang digunakan untuk testing API.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Data seed berhasil dibuat.',
  })
  @ApiResponse({
    status: 401,
    description:
      'App Key tidak valid.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Data seed untuk App Maker ini sudah dibuat.',
  })
  runSeed(
    @Req()
    req: Request & {
      appMaker: {
        id: number;
      };
    },
  ) {
    return this.seedService.runSeed(
      req.appMaker.id,
    );
  }
}
