import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StockGateway } from 'src/stock/stock.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockGateway: StockGateway,
  ) {}

  async create(newProduct: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        stock: newProduct.stock,
        imageUrl: newProduct.imageUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    // Si el stock fue actualizado, emitir el evento
    if (updateProductDto.stock !== undefined) {
      this.stockGateway.updateStock(id, updateProductDto.stock);
    }
    return updatedProduct;
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getProductsByCategory(id: string) {
    return this.prisma.product.findMany({
      where: { categoryId: id },
    });
  }
}
