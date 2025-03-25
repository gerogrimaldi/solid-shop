import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  //  ########################################################################################################
  // LOGIN 
  async login(user: any, res: Response) {
    // el payload genera los claims del token
    const payload = { 
      sub: user.id,
      username: user.username, 
      email: user.email ,
      roles: Array.isArray(user.Role) ? user.Role : [user.Role],
    };
    const access_token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "supersecret",
      expiresIn: '30m'
    })
    const refresh_token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET2 || "supersecret2",
      expiresIn: '3h'
    })
    res.cookie('Authentication', access_token, {
      secure: true, //solo HTTPS
      httpOnly: true, //previene XSS
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
    })
    res.cookie('RefreshToken', refresh_token, {
      secure: true,      
      httpOnly: true,     
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 dias
      sameSite: 'strict', // previene CSRF
    });
    return { access_token, refresh_token } ;
  }

  // LOGOUT
  async logout(res: Response) {
      res.clearCookie('Authentication');
      res.clearCookie('RefreshToken');
      res.status(200);
      res.statusMessage = 'Logout exitoso';
      return res.status(200).json({ message: 'Logout exitoso' });
  }

  //  ########################################################################################################
// VALDIACIONES
  // local validacion de credenciales 
  async validateUser(loginAuthDto: LoginAuthDto) {
     // recibe email y contraseña
    const user = await this.userService.getUserByEmail(loginAuthDto.email);
    // getUserByEmail retorna el usuario completo con contraseña
    if (!user || !(await bcrypt.compare(loginAuthDto.password, user.password))) {
      return null;
    }

  // aca ya nno devuelve la contraseña del user, si los demas datos
    const {password, ...result} = user;
    return result;
  }

  async verifyToken(req, res: Response) {
    try {
      const token = req.cookies['Authentication'];
      
      if (!token) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "supersecret"
      });

      console.log("inside verifiToken")
      return res.json({
        username: payload.username,
        email: payload.email,
        roles: payload.roles
      });
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  }

  //  ########################################################################################################
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

    //  ########################################################################################################
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
