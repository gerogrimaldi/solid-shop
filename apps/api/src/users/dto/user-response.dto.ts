import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude() // Esto si activa el modo seguro
export class UserResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id: string;
  
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  role: string;


  @IsNotEmpty()
  @IsString()
  wishListId: string;

  @IsNotEmpty()
  @IsString()
  cartId: string;

  @Exclude() // evita que la contraseña se exponga al transformar el objeto
  password: string;
}
