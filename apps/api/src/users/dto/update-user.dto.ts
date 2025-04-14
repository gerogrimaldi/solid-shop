import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';

@Exclude()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsDate()
    updatedAt: Date = new Date();
}
