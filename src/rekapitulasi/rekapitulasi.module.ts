import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RekapitulasiController } from './rekapitulasi.controller';
import { RekapitulasiService } from './rekapitulasi.service';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'eco-waste-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [
    RekapitulasiController,
  ],
  providers: [
    RekapitulasiService,
    AppKeyGuard,
    JwtGuard,
    AdminGuard,
  ],
})
export class RekapitulasiModule {}
