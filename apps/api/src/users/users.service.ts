import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // POST
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

  // GETTERS
  async findAll(): Promise<UserResponseDto[]>  {
    try {
      const users = await this.prisma.user.findMany();

      if (!users) {
        throw new HttpException(`users array not found`, HttpStatus.NOT_FOUND);
      }

      // quito la contraseña de la respuesta
      return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
    }
    catch(error) {
        throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }


  async getUserById(id: string) {
  // busco el usuario por id
  try {
    const user = await this.prisma.user.findUnique({
      where: {id}
    });

    if (!user) {
      throw new HttpException(`users array not found`, HttpStatus.NOT_FOUND);
    }

    // quito la contraseña de la respuesta
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }
  catch(error) {
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });
  
      return user;
    } 
    catch (error: any) {
      if (error.code === 'P2025') { // No se encontró el usuario
        throw new NotFoundException(`User with email ${email} not found`);
      }
      throw new BadRequestException(error.message || 'Error fetching user');
    }
    }

    // PATCH
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
  
      return { message: `User with id: ${updatedUser.id} updated successfully` };
    } catch (error: any) {
      if (error.code === 'P2025') { // No se encontró el usuario
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new BadRequestException(error.message || 'Error updating user');
    }
  }

  // DELETE
  async remove(id: string) {
    try {
      await this.prisma.user.delete({ 
        where: { id } 
      });

      return { message: `User with id: ${id} deleted successfully` };
    } catch (error: any) {
      if (error.code === 'P2025') { // No se encontró el usuario
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new BadRequestException(error.message || 'Error deleting user');
    }
  }
  

  async removeByEmail(email: string) {
    try {
      await this.prisma.user.delete({ 
        where: { email } 
      });

      return { message: `User with email: ${email} deleted successfully` };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Error deleting user');
    }
  }

}
