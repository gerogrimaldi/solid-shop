import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';
import { AcceptedRoles } from 'src/authorization/custom-decorators/roles.decorator';
import { RolesGuard } from 'src/authorization/custom-decorators/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor( private readonly categoriesService: CategoriesService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AcceptedRoles('ADMIN')
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
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AcceptedRoles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AcceptedRoles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
