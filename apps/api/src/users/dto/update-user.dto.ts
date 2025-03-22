import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    updatedAt: Date = new Date();
}
