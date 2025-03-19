import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }


  async getProductsByCategory(name: string) {
    // Buscar la categoría por nombre
    const category = await this.prisma.category.findFirst({
      where: { name },
    });
  
    if (!category) {
      throw new Error(`La categoría '${name}' no existe`);
    }
  
    // Buscar productos con el id
    const products = this.productsService.getProductsByCategory(category.id);
    
    return products;
  }
  
}
