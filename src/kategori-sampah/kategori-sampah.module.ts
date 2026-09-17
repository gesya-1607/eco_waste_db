import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { KategoriSampahController } from './kategori-sampah.controller';
import { KategoriSampahService } from './kategori-sampah.service';

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
    KategoriSampahController,
  ],

  providers: [
    KategoriSampahService,
    AppKeyGuard,
    JwtGuard,
    AdminGuard,
  ],
})
export class KategoriSampahModule {}
