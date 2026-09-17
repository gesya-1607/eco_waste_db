import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { MakerService } from './maker.service';
import { RegisterAppMakerDto } from './dto/register-app-maker.dto';
import { LoginAppMakerDto } from './dto/login-app-maker.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AppKeyGuard } from '../auth/guards/app-key.guard';

@ApiTags('Maker')
@Controller('api/v1/maker')
export class MakerController {
  constructor(
    private readonly makerService: MakerService,
  ) {}

  // ==========================================
  // REGISTER APP MAKER
  // ==========================================
  @Post('register')
  @ApiOperation({
    summary: 'Register App Maker',
    description: 'Mendaftarkan akun App Maker baru.',
  })
  @ApiBody({
    type: RegisterAppMakerDto,
  })
  @ApiResponse({
    status: 201,
    description: 'App Maker berhasil didaftarkan.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email sudah terdaftar.',
  })
  register(@Body() dto: RegisterAppMakerDto) {
    return this.makerService.register(dto);
  }

  // ==========================================
  // LOGIN APP MAKER
  // ==========================================
  @Post('login')
  @ApiOperation({
    summary: 'Login App Maker',
    description: 'Login menggunakan email dan password App Maker.',
  })
  @ApiBody({
    type: LoginAppMakerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil dan mendapatkan JWT serta App Key.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email atau password salah.',
  })
  login(@Body() dto: LoginAppMakerDto) {
    return this.makerService.login(dto);
  }

  // ==========================================
  // PROFILE APP MAKER
  // ==========================================
  @Get('profile')
  @UseGuards(AppKeyGuard, JwtGuard)
  @ApiOperation({
    summary: 'Get Profile App Maker',
    description:
      'Mengambil data profile App Maker yang sedang login.',
  })
  @ApiSecurity('app-key')
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Profile App Maker berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key atau JWT tidak valid.',
  })
  profile(
    @Req()
    req: Request & {
      user: {
        sub: number;
        type: string;
      };
    },
  ) {
    const user = req.user;

    return this.makerService.profile(user.sub);
  }

  // ==========================================
  // CHECK APP KEY
  // ==========================================
  @Get('check-key')
  @ApiOperation({
    summary: 'Check App Key',
    description: 'Memeriksa apakah App Key yang diberikan valid.',
  })
  @ApiSecurity('app-key')
  @ApiResponse({
    status: 200,
    description: 'App Key valid.',
  })
  @ApiResponse({
    status: 401,
    description: 'App Key tidak valid.',
  })
  checkKey(
    @Headers('x-app-key') appKey: string,
  ) {
    return this.makerService.checkKey(appKey);
  }
}
