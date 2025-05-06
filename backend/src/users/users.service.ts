import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common';
import { User } from '@Prisma/client';
import { omit } from 'lodash';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the profile of a user by their unique identifier.
   *
   * @param userId - The unique identifier of the user whose profile is to be retrieved.
   * @returns A promise that resolves to the user object excluding the password field.
   * @throws NotFoundException - If no user is found with the given identifier.
   */
  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return omit(user, 'password');
  }

  /**
   * Updates the profile of a user with the given data.
   *
   * @param userId - The unique identifier of the user whose profile is to be updated.
   * @param dto - An object containing the profile data to update.
   * @returns A promise that resolves to the updated user object, excluding the password field.
   *
   * @throws {NotFoundException} If the user with the specified ID does not exist.
   * @throws {Prisma.PrismaClientKnownRequestError} If there is an issue with the database operation.
   */
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });

    return omit(updatedUser, 'password');
  }

  /**
   * Changes the password of a user.
   *
   * @param userId - The unique identifier of the user whose password is to be changed.
   * @param dto - An object containing the current password and the new password.
   * @returns A promise that resolves to an object containing a success message.
   * @throws {ForbiddenException} If the current password is invalid or the user does not exist.
   *
   * The function performs the following steps:
   * 1. Retrieves the user by their unique ID.
   * 2. Verifies that the provided current password matches the stored password.
   * 3. Hashes the new password and updates the user's password in the database.
   * 4. Returns a success message upon successful password change.
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new ForbiddenException('Invalid current password');
    }

    const newHashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newHashed,
      },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Retrieves all users from the database, omitting their password field.
   *
   * @returns A promise that resolves to an array of user objects,
   *          each excluding the 'password' property.
   */
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => omit(user, 'password'));
  }

  /**
   * Updates a user's information as an admin.
   *
   * @param userId - The unique identifier of the user to be updated.
   * @param dto - The data transfer object containing the updated user information.
   * @returns The updated user object with the password field omitted.
   *
   * @throws {Prisma.PrismaClientKnownRequestError} If the user with the specified ID does not exist.
   */
  async adminUpdateUser(userId: string, dto: AdminUpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return omit(updatedUser, 'password');
  }

  /**
   * Deletes a user from the database by their unique identifier.
   *
   * @param userId - The unique identifier of the user to be deleted.
   * @returns The deleted user object with the password field omitted.
   *
   * @throws Will throw an error if the user does not exist or if the deletion fails.
   */
  async deleteUser(userId: string) {
    const deletedUser = await this.prisma.user.delete({
      where: { id: userId },
    });

    return omit(deletedUser, 'password');
  }
}
