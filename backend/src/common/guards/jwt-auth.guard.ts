import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: any, user: TUser | null): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Access denied');
    }
    return user;
  }
}
