import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
        updatedAt: updateCategoryDto.updatedDate
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }

  // Obtener productos por categoría
  async getProductsByCategory(categoryName: string) {
    const category = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category)
          throw new NotFoundException(`Category with name: ${categoryName} not found`);

    return await this.prisma.product.findMany({
      where: { categoryId: category.id },
    });
  }
}
