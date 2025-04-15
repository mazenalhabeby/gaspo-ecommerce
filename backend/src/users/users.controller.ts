import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { Roles, RolesGuard, JwtAuthGuard, UserRole } from 'src/common';
import { RequestWithUser } from 'src/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  /**
   * Retrieves the profile of the currently authenticated user.
   *
   * @param req - The request object containing the authenticated user's information.
   * @returns The profile data of the user identified by their unique identifier (sub).
   */
  getProfile(@Req() req: RequestWithUser) {
    return this.userService.getProfile(req.user.sub);
  }

  @Patch('me')
  /**
   * Updates the profile of the currently authenticated user.
   *
   * @param req - The request object containing the authenticated user's information.
   * @param dto - The data transfer object containing the updated profile information.
   * @returns A promise resolving to the updated user profile.
   */
  updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.sub, dto);
  }

  @Patch('me/password')
  /**
   * Handles the request to change the password of the currently authenticated user.
   *
   * @param req - The HTTP request object containing the authenticated user's information.
   * @param dto - The data transfer object containing the new password details.
   * @returns A promise resolving to the result of the password change operation.
   */
  changePassword(@Req() req: RequestWithUser, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.sub, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  /**
   * Retrieves a list of all users.
   *
   * @returns An array of user objects.
   */
  getAll() {
    return this.userService.getAllUsers();
  }

  @Patch(':userId')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  /**
   * Updates a user's information as an admin.
   *
   * @param userId - The unique identifier of the user to be updated.
   * @param dto - The data transfer object containing the updated user information.
   * @returns A promise resolving to the updated user information.
   */
  adminUpdate(
    @Param('userId') userId: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.userService.adminUpdateUser(userId, dto);
  }

  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  /**
   * Deletes a user by their unique identifier.
   *
   * @param userId - The unique identifier of the user to be deleted.
   * @returns A promise that resolves with the result of the deletion operation.
   */
  delete(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
