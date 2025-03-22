import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
