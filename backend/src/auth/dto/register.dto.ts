import { IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
