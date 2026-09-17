import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const appKey = request.headers['x-app-key'];

    if (!appKey) {
      throw new UnauthorizedException(
        'x-app-key diperlukan',
      );
    }

    const appMaker = await this.prisma.appmaker.findUnique({
      where: {
        appKey: appKey as string,
      },
    });

    if (!appMaker) {
      throw new UnauthorizedException(
        'App key tidak valid',
      );
    }

    request.appMaker = appMaker;

    return true;
  }
}
