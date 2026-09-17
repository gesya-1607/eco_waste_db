import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization header diperlukan',
      );
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Format Authorization tidak valid',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }
  }
}
