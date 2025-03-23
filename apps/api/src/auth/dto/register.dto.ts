import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// @Exclude()
export class RegisterAuthDto{
   @Expose()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(15)
    @ApiProperty()
    username: string;
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @ApiProperty()
    password: string;
}
