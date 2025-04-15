import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from '../services/redis.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(private readonly redis: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (token && (await this.redis.isBlacklisted(token))) {
      throw new UnauthorizedException('Access Token is blacklisted');
    }

    next();
  }
}
