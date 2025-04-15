import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from 'src/common';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ cookies?: { [key: string]: string }; user?: any }>();
    const token = request.cookies?.['refresh_token'];

    if (!token) {
      throw new UnauthorizedException('No session token provided');
    }

    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as { sub: string };
    const session = await this.redis.getUserIdFromToken(token);

    if (!session || session !== token) {
      throw new UnauthorizedException('Invalid session');
    }

    request.user = decoded;
    return true;
  }
}
