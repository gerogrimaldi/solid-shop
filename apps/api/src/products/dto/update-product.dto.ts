import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsDate } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsDate()
    updateDate?: Date = new Date()
}
