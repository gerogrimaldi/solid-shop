import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

 async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {email: createUserDto.email }
    });
    if (existingUser) {
      throw new HttpException(`user with email: ${createUserDto.email} already exists`, HttpStatus.CONFLICT);
    }
    
    
    try{
      // crear carrito y wishlist
      const cart = await this.prisma.cart.create({
        data: {}
      });
      const wishlist = await this.prisma.wishlist.create({
        data: {}
      });

      // crear usuario
      return  this.prisma.user.create({
        data: {
          ...createUserDto,
          wishlist: {
            connect: { id: wishlist.id }
          },
          cart: {
            connect: { id: cart.id }
          },
        }
      });
    }catch(error){
      return error
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();

      if (!users) {
        throw new HttpException(`users array not found`, HttpStatus.NOT_FOUND);
      }

      return users
    }
    catch(error) {
        return error
      }
  }

  async getUserById(id: string) {
  // busco el usuario por id
    const user = await this.prisma.user.findUnique({
      where: {id: id}
    });
    // si no existe el usuario, devuelvo un error
    if (!user) {
      throw new HttpException(`user with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    // busco el usuario por email
      const user = this.prisma.user.findUnique({
        where: {email}
      });
      // si no existe el usuario, devuelvo un error
      if (!user) {
        throw new HttpException(`user with email: ${email} not found`, HttpStatus.NOT_FOUND);
      }
      return user;
    }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // busco el usuario por id
    const user = await this.prisma.user.findUnique({
      where: {id: id}
    });
    // si no existe el usuario, devuelvo un error
    if (!user) {
      throw new HttpException(`user with id: ${id} not found`, HttpStatus.NOT_FOUND);
    };
    // actualizo el usuario
    const updatedUser = await this.prisma.user.update({
      where: {id: id},
      data: updateUserDto
    });
    return `user with id: ${updatedUser.id} updated successfully`;
  }

  async remove(id: string) {
    // busco el usuario por id
    const user = await this.prisma.user.findUnique({
      where: {id: id}
    });
    // si no existe el usuario, devuelvo un error
    if (!user) {
      throw new HttpException(`user with id: ${id} not found`, HttpStatus.NOT_FOUND);
    };
    // elimino el usuario
    await this.prisma.user.delete({
      where: {id: id}
    });
    return `user with id: ${id} deleted successfully`;
  }
  
  async removeByEmail(email: string) {
    // busco el usuario por id
    const user = await this.prisma.user.findUnique({
      where: {email: email}
    });
    // si no existe el usuario, devuelvo un error
    if (!user) {
      throw new HttpException(`user with email: ${email} not found`, HttpStatus.NOT_FOUND);
    };
    // elimino el usuario
    await this.prisma.user.delete({
      where: {email: email}
    });
    return `user with id: ${email} deleted successfully`;
  }
}
