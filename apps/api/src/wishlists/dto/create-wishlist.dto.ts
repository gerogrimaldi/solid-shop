import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, minLength } from "class-validator";

export class CreateWishlistItemDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    productId: string;
}
