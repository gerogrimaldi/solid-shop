import { PartialType } from '@nestjs/swagger';
import { CreateWishlistItemDto } from './create-wishlist.dto';
import { IsDate } from 'class-validator';

export class UpdateWishlistItemDto extends PartialType(CreateWishlistItemDto) {
    @IsDate()
    updateDate: Date = new Date();
}
