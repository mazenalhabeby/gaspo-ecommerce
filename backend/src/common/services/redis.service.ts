import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async setSession(userId: string, refreshToken: string): Promise<void> {
    const existingToken = await this.findRefreshTokenByUserId(userId);
    if (existingToken) {
      await this.client.del(this.getSessionKey(existingToken));
    }
    const key = this.getSessionKey(refreshToken);
    await this.client.set(key, userId, 'EX', 60 * 60 * 24 * 7);
  }

  async getUserIdFromToken(refreshToken: string): Promise<string | null> {
    const key = this.getSessionKey(refreshToken);
    return await this.client.get(key);
  }

  async deleteSessionByToken(refreshToken: string): Promise<void> {
    const key = this.getSessionKey(refreshToken);
    await this.client.del(key);
  }

  async blackListAccessToken(token: string): Promise<void> {
    const key = this.getBlackListKey(token);
    await this.client.set(key, 'true', 'EX', 60 * 15);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = this.getBlackListKey(token);
    const result = await this.client.get(key);
    return result === 'true';
  }

  private getSessionKey(refreshToken: string): string {
    return `session:${refreshToken}`;
  }

  private getBlackListKey(token: string): string {
    return `blacklist:${token}`;
  }

  private async findRefreshTokenByUserId(
    userId: string,
  ): Promise<string | null> {
    const keys = await this.client.keys(`session:*`);
    for (const key of keys) {
      const storedUserId = await this.client.get(key);
      if (storedUserId === userId) {
        return key.split(':')[1]; // Extract the refresh token from the key
      }
    }
    return null;
  }
}
