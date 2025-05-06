import { UsersController } from './users.controller';
import { UserRole, RolesGuard, JwtAuthGuard, RequestWithUser } from '../common'; // Adjust the path as needed
import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AdminUpdateUserDto, ChangePasswordDto, UpdateProfileDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserId = 'user123';
  const mockReq = { user: { sub: mockUserId } } as RequestWithUser;

  const mockUsersService = {
    getProfile: jest
      .fn()
      .mockResolvedValue({ id: mockUserId, email: 'test@example.com' }),
    updateProfile: jest
      .fn()
      .mockResolvedValue({ firstName: 'John', lastName: 'Doe' }),
    changePassword: jest.fn().mockResolvedValue({ success: true }),
    getAllUsers: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
    adminUpdateUser: jest.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    deleteUser: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return current user profile', async () => {
    const result = await controller.getProfile(mockReq);
    expect(result).toEqual({ id: mockUserId, email: 'test@example.com' });
  });

  it('should update user profile', async () => {
    const dto: UpdateProfileDto = { firstName: 'John', lastName: 'Doe' };
    const result = await controller.updateProfile(mockReq, dto);
    expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
  });

  it('should change user password', async () => {
    const dto: ChangePasswordDto = {
      currentPassword: 'old',
      newPassword: 'new',
    };
    const result = await controller.changePassword(mockReq, dto);
    expect(result).toEqual({ success: true });
  });

  it('should get all users as admin', async () => {
    const result = await controller.getAll();
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('should admin update a user', async () => {
    const dto: AdminUpdateUserDto = { role: UserRole.ADMIN };
    const result = await controller.adminUpdate('user456', dto);
    expect(result).toEqual({ role: UserRole.ADMIN });
  });

  it('should delete a user as admin', async () => {
    const result = await controller.delete('user456');
    expect(result).toEqual({ success: true });
  });
});
