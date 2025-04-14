import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, minLength } from "class-validator";

export class CreateWishlistItemDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    wishlistId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    productId: string;
}
