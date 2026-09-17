import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'eco-waste-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AppKeyGuard,
    JwtGuard,
    AdminGuard,
  ],
})
export class AdminModule {}
