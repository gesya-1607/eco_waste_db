import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { MakerModule } from './maker/maker.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { KategoriSampahModule } from './kategori-sampah/kategori-sampah.module';
import { SetorSampahModule } from './setor-sampah/setor-sampah.module';
import { HadiahModule } from './hadiah/hadiah.module';
import { PenukaranPoinModule } from './penukaran-poin/penukaran-poin.module';
import { RekapitulasiModule } from './rekapitulasi/rekapitulasi.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    PrismaModule,
    MakerModule,
    AuthModule,
    AdminModule,
    KategoriSampahModule,
    SetorSampahModule,
    HadiahModule,
    PenukaranPoinModule,
    RekapitulasiModule,
    DashboardModule,
    SeedModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
