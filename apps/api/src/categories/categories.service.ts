import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }

  // Obtener productos por categoría
  async getProductsByCategory(categoryId: string) {
    return await this.prisma.product.findMany({
      where: { categoryId },
    });
  }
}
