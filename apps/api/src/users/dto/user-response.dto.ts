import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserResponseDto {
    @IsNotEmpty()
    @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @Exclude() // 🔹 Evita que la contraseña se exponga al transformar el objeto
  password: string;
}
