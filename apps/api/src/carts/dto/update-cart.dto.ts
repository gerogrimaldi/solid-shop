import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart.dto';
import { IsDate } from 'class-validator';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
    @IsDate()
    updateDate: Date = new Date();
}
