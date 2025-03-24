import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  // LOGIN 
  async login(user: any) {
    // el payload genera los claims del token
    const payload = { 
      sub: user.id,
      username: user.username, 
      email: user.email ,
      roles: Array.isArray(user.Role) ? user.Role : [user.Role],
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || "supersecret",
        expiresIn: '30m'
      }),
    };
  }

  // local validacion de credenciales 
  async validateUser(loginAuthDto: LoginAuthDto) {
   
    const user = await this.userService.getUserByEmail(loginAuthDto.email);
    if (!user || !(await bcrypt.compare(loginAuthDto.password, user.password))) {
      return null;
    }

    const {password, ...result} = user;
    return result;
  }

  // REGISTER
  async register(registerAuthDto: RegisterAuthDto) {
    const hashedPassword: string = await bcrypt.hash(registerAuthDto.password, 10);
    const user = await this.userService.createUser({
      username: registerAuthDto.username,
      email: registerAuthDto.email,
      password: hashedPassword,
    });

    const transformedUser = plainToInstance(User, user);
    
    return transformedUser;
  }

  // UPDATE
  async updateUser(id:string, registerAuthDto: RegisterAuthDto) {
    const hashedPassword: string = await bcrypt.hash(registerAuthDto.password, 10);
    const user = await this.userService.update(
      id,
      {
        username: registerAuthDto.username,
        email: registerAuthDto.email,
        password: hashedPassword,
        updatedAt: new Date()
      }
    );

    const transformedUser = plainToInstance(User, user);
    
    return transformedUser;
  }


}
