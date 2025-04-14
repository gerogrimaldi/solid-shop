import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreateCartItemDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    cartId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    productId: string;
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    quantity: number;
}
