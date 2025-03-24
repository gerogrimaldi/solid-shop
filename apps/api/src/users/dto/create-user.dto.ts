import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, Length, MaxLength, MinLength } from 'class-validator';

// @Exclude()
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3,50)
    @ApiProperty()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(3,50)
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
