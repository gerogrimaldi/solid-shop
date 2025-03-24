import { IsNotEmpty, IsString, MaxLength, MinLength, minLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
