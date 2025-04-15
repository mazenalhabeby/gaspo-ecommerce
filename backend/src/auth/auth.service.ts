import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PrismaService,
  RedisService,
  JwtPayload,
  RequestWithCookies,
} from 'src/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '@Prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Registers a new user by creating an account with the provided details.
   *
   * @param dto - The data transfer object containing the user's registration details.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   *
   * @throws {BadRequestException} If the email is already registered.
   */
  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already registered');
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    return this.generateTokens(user);
  }

  /**
   * Authenticates a user by validating their credentials and generates access and refresh tokens.
   *
   * @param dto - The login data transfer object containing the user's email and password.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   * @throws {UnauthorizedException} If the provided credentials are invalid.
   */
  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    const valid = user && (await bcrypt.compare(dto.password, user.password));
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  /**
   * Refreshes the access and refresh tokens based on the provided request.
   *
   * This method extracts the refresh token from the incoming request, validates it,
   * verifies the user's session, and generates new tokens for the user.
   *
   * @param req - The HTTP request object containing the refresh token.
   * @returns A promise that resolves to an object containing the new access token
   * and refresh token.
   *
   * @throws {UnauthorizedException} If the user is not found or the token is invalid.
   */
  async refreshTokensFromRequest(
    req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const oldAccessToken = this.extractAccessToken(req);
    if (oldAccessToken) {
      await this.redis.blackListAccessToken(oldAccessToken);
    }
    const token = this.extractRefreshToken(req);
    const userId = await this.getUserIdFromRefreshToken(token);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('User not found');

    return this.generateTokens(user);
  }

  /**
   * Logs out a user by invalidating their session based on the refresh token
   * extracted from the provided request.
   *
   * @param req - The HTTP request object containing the refresh token.
   * @returns A promise that resolves when the session is successfully deleted.
   *
   * @remarks
   * This method extracts the refresh token from the request, decodes the user ID
   * from the token, and deletes the user's session from Redis if the user ID is valid.
   */
  async logoutFromRequest(req: Request): Promise<void> {
    const token = this.extractAccessToken(req);
    if (token) {
      await this.redis.blackListAccessToken(token);
    }

    const refreshToken = this.extractRefreshToken(req);

    if (refreshToken) {
      await this.redis.deleteSessionByToken(refreshToken);
    }
  }

  /**
   * Sets a refresh token cookie in the HTTP response.
   *
   * @param res - The HTTP response object where the cookie will be set.
   * @param token - The refresh token to be stored in the cookie.
   *
   * The cookie is configured with the following properties:
   * - `httpOnly`: Ensures the cookie is accessible only by the web server.
   * - `secure`: Indicates that the cookie should only be sent over HTTPS when in production.
   * - `sameSite`: Restricts the cookie to be sent only with requests from the same site.
   * - `path`: Specifies the root path (`/`) for which the cookie is valid.
   * - `maxAge`: Sets the cookie's expiration time to 7 days (in milliseconds).
   */
  setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  /**
   * Clears the 'refresh_token' cookie from the client's browser.
   *
   * This method ensures that the specified cookie is removed by calling the `clearCookie` method
   * on the provided `Response` object. If the `Response` object does not support the `clearCookie` method,
   * an error is thrown.
   *
   * @param res - The HTTP response object used to clear the cookie. Must support the `clearCookie` method.
   * @throws {Error} If the `Response` object does not support the `clearCookie` method.
   */
  clearRefreshTokenCookie(res: Response): void {
    if (!res.clearCookie) {
      throw new Error('Response object does not support clearCookie');
    }
    res.clearCookie('refresh_token', { path: '/' });
  }

  /**
   * Generates access and refresh tokens for a given user.
   *
   * @param user - The user object containing user details such as ID and role.
   * @returns An object containing the generated `accessToken` and `refreshToken`.
   *
   * @remarks
   * - The `accessToken` is a JWT signed with the user's payload and has a short expiration time (e.g., 15 minutes).
   * - The `refreshToken` is a UUID that is stored in the Redis session for the user.
   * - The `refreshToken` can be used to obtain a new `accessToken` when the current one expires.
   *
   * @throws Will throw an error if there is an issue with signing the JWT or storing the session in Redis.
   */
  private async generateTokens(user: User) {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = crypto.randomUUID();

    await this.redis.setSession(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  /**
   * Extracts the refresh token from the cookies in the incoming request.
   *
   * @param req - The incoming request object containing cookies.
   * @returns The refresh token as a string.
   * @throws {UnauthorizedException} If the refresh token is not provided or is not a valid string.
   */
  private extractRefreshToken(req: RequestWithCookies): string {
    const token = req.cookies['refresh_token'];
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('No refresh token provided');
    }
    return token;
  }

  /**
   * Retrieves the user ID associated with a given refresh token.
   *
   * @param token - The refresh token to validate and extract the user ID from.
   * @returns A promise that resolves to the user ID if the token is valid.
   * @throws {UnauthorizedException} If the refresh token is invalid or no user ID is found.
   */
  private async getUserIdFromRefreshToken(token: string): Promise<string> {
    const userId = await this.redis.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return userId;
  }

  private extractAccessToken(req: Request): string | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No access token provided');
    }
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
