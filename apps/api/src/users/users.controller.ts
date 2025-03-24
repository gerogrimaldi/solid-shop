import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserByEmailRequestDto } from './dto/get-user-by-email';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { RolesGuard } from 'src/auth/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/auth/custom-decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
// @AcceptedRoles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}
