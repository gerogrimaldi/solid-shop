import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, } from 'class-validator';

// @Exclude()
export class RegisterAuthDto{
    @IsNotEmpty()
     @IsString()
     @Length(3,20)
     @ApiProperty()
     username: string;
     
     @IsNotEmpty()
     @IsString()
     @IsEmail()
     @ApiProperty()
     email: string;
 
     @IsNotEmpty()
     @IsString()
     @IsStrongPassword({
         minLength: 8,
         minLowercase: 1,
         minNumbers: 1,
         minSymbols: 1,
         minUppercase: 1
     })
     @ApiProperty()
     password: string;
}
