import { ApiProperty } from '@nestjs/swagger';

// @Exclude()
export class CreateUserDto {

    @ApiProperty()
    username: string;
    

    @ApiProperty()
    email: string;


    @ApiProperty()
    password: string;
}
