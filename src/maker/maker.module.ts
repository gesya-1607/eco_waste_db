import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MakerController } from './maker.controller';
import { MakerService } from './maker.service';
import { AuthModule } from '../auth/auth.module';
import { AppKeyGuard } from '../auth/guards/app-key.guard';

@Module({
  imports: [
    AuthModule,

    JwtModule.register({
      secret: 'eco-waste-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [MakerController],
  providers: [MakerService, AppKeyGuard],
})
export class MakerModule {}
