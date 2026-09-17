import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { AppKeyGuard } from './guards/app-key.guard';
import { NasabahGuard } from './guards/nasabah/nasabah.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'eco-waste-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
    AppKeyGuard,
    NasabahGuard,
  ],
  exports: [
    AuthService,
    JwtGuard,
    NasabahGuard,
  ],
})
export class AuthModule {}
