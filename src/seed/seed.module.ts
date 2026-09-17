import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';

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
    SeedController,
  ],
  providers: [
    SeedService,
    AppKeyGuard,
    JwtGuard,
  ],
})
export class SeedModule {}
