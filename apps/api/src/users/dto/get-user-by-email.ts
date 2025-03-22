import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetUserByEmailRequestDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}