import { ApiProperty } from "@nestjs/swagger";

export class requestCartDto {
    @ApiProperty()
    userId: string;
}
