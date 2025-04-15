import { UserRole } from '@/common';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole as object)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
