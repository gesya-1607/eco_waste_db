import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class NasabahGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User belum terautentikasi');
    }

    if (user.role !== 'NASABAH') {
      throw new ForbiddenException('Akses hanya untuk Nasabah');
    }

    return true;
  }
}
