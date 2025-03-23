import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { AcceptedRoles } from 'src/custom-decorators/roles.decorator';
import { RolesGuard } from 'src/custom-decorators/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @AcceptedRoles('ADMIN')
@Controller('categories')
export class CategoriesController {
  constructor( private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(id);
  // }

  @Get(':name')
  async getProductsByCategory(@Param('name') name: string) {
    return this.categoriesService.getProductsByCategory(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
