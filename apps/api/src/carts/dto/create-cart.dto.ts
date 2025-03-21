import { ApiProperty } from "@nestjs/swagger";

export class CreateCartItemDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    productId: string;
    
    @ApiProperty()
    quantity: number;
}
