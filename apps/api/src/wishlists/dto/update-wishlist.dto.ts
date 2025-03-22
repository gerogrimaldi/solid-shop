import { PartialType } from '@nestjs/swagger';
import { CreateWishlistItemDto } from './create-wishlist.dto';

export class UpdateWishlistItemDto extends PartialType(CreateWishlistItemDto) {
    updateDate: Date = new Date();
}
