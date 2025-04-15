import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  /**
   * Handles user registration by accepting registration details,
   * generating access and refresh tokens, and setting the refresh token
   * as a cookie in the response.
   *
   * @param dto - The registration data transfer object containing user details.
   * @param res - The HTTP response object with passthrough enabled for setting cookies.
   * @returns An object containing the generated access token.
   */
  async resigter(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    this.authService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  /**
   * Handles user login by validating credentials and generating access and refresh tokens.
   *
   * @param dto - The login data transfer object containing user credentials.
   * @param res - The HTTP response object used to set the refresh token cookie.
   * @returns An object containing the generated access token.
   *
   * @remarks
   * This method delegates the authentication logic to the `authService`.
   * It sets the refresh token as an HTTP-only cookie in the response for security purposes.
   */
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    this.authService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  //TODO the refresh path not work corectly almost find the error in chat gpt
  @Post('refresh')
  /**
   * Handles the refresh of authentication tokens.
   *
   * This method retrieves new access and refresh tokens by processing the incoming request.
   * It sets the new refresh token as a cookie in the response and returns the new access token.
   *
   * @param req - The incoming HTTP request containing the current tokens.
   * @param res - The HTTP response object where the new refresh token cookie will be set.
   * @returns An object containing the new access token.
   */
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.refreshTokensFromRequest(req);

    this.authService.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('logout')
  /**
   * Logs out the user by invalidating their session and clearing the refresh token cookie.
   *
   * @param req - The incoming HTTP request object containing user session details.
   * @param res - The HTTP response object used to clear the refresh token cookie.
   * @returns An object containing a success message indicating the user has been logged out.
   */
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutFromRequest(req);
    this.authService.clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }
}
