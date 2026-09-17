import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SetorSampahController } from './setor-sampah.controller';
import { SetorSampahService } from './setor-sampah.service';
import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { NasabahGuard } from '../auth/guards/nasabah/nasabah.guard';

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
    SetorSampahController,
  ],

  providers: [
    SetorSampahService,
    AppKeyGuard,
    JwtGuard,
    AdminGuard,
    NasabahGuard,
  ],
})
export class SetorSampahModule {}
