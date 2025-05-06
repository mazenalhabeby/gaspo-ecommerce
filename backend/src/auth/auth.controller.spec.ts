import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest
      .fn()
      .mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' }),
    login: jest
      .fn()
      .mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' }),
    refreshTokensFromRequest: jest.fn().mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    }),
    logoutFromRequest: jest.fn(),
    setRefreshTokenCookie: jest.fn(),
    clearRefreshTokenCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register user', async () => {
    const dto: RegisterDto = {
      email: 'test@mail.com',
      password: '123456',
      firstName: 'Test',
      lastName: 'User',
    };
    const mockRes = { cookie: jest.fn() } as unknown as Response;
    const result = await controller.resigter(dto, mockRes);
    expect(result.accessToken).toBe('access');
  });

  it('should login user', async () => {
    const dto: LoginDto = { email: 'test@mail.com', password: '123456' };
    const mockRes = { cookie: jest.fn() } as unknown as Response;
    const result = await controller.login(dto, mockRes);
    expect(result.accessToken).toBe('access');
  });

  it('should refresh tokens', async () => {
    const mockReq = {
      cookies: { refresh_token: 'refresh' },
    } as unknown as Request;
    const mockRes = { cookie: jest.fn() } as unknown as Response;
    const result = await controller.refresh(mockReq, mockRes);
    expect(result.accessToken).toBe('new-access');
  });

  it('should logout user', async () => {
    const mockReq = {
      cookies: { refresh_token: 'refresh' },
    } as unknown as Request;
    const mockRes = { clearCookie: jest.fn() } as unknown as Response;
    const result = await controller.logout(mockReq, mockRes);
    expect(result.message).toBe('Logged out successfully');
  });
});
