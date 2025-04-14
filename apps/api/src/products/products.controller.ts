import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';
import { RolesGuard } from 'src/authorization/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/authorization/custom-decorators/roles.decorator';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AcceptedRoles('ADMIN')
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // se añade esta funcion como mock para el home
  @Get("limited/:limit")
  findLimited(@Param('limit') limit: string) {
    return this.productsService.findLimited(parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @AcceptedRoles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AcceptedRoles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('category/:categoryId')
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory(categoryId);
  }
}
