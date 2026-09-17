import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

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
    DashboardController,
  ],
  providers: [
    DashboardService,
    AppKeyGuard,
    JwtGuard,
    AdminGuard,
  ],
})
export class DashboardModule {}
