<<<<<<< HEAD
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
>>>>>>> 08788c5e8a060cbacc521f3182804ae88e9ef179
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AcceptedRoles } from 'src/auth/custom-decorators/roles.decorator';
import { RolesGuard } from 'src/auth/custom-decorators/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
<<<<<<< HEAD
  constructor(private readonly categoriesService: CategoriesService) {}

=======
  constructor( private readonly categoriesService: CategoriesService) {}
  
  @AcceptedRoles('ADMIN')
>>>>>>> 08788c5e8a060cbacc521f3182804ae88e9ef179
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
  
  @AcceptedRoles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  
  @AcceptedRoles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
