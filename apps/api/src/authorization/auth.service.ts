import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}
    //  ########################################################################################################
  // Funciones auxiliares para crear y setear los tokens en las cookies
  private getTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {  
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessExpiresIn, 
    });
    const refreshToken = this.jwtService.sign(payload, { 
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn
     });
    return { accessToken, refreshToken };
  }
  
  private setCookies(res: Response, accessToken: string, refreshToken: string) {

    res.cookie('Authentication', accessToken, {
      secure: true, //solo HTTPS
      httpOnly: true, //previene XSS
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
    })
    res.cookie('RefreshToken', refreshToken, {
      secure: true,      
      httpOnly: true,     
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 dias
      sameSite: 'strict', // previene CSRF
    });
  }

  //  ########################################################################################################
  // LOGIN Y REFRESH
  async login(user: any, res: Response) {
    // el payload genera los claims del token
    const payload = { 
      sub: user.id,
      username: user.username, 
      email: user.email ,
      roles: Array.isArray(user.Role) ? user.Role : [user.Role],
      cartId: user.cartId,
      wishlistId: user.wishlistId,
    };
    const tokens = this.getTokens(payload);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    const result = {...payload, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken};
    return result;
  }

  // REFRESH
  async refreshToken(user: any, res: Response) {
    // el payload genera los claims del token
    const payload = { 
      sub: user.sub, //campo distinto al login ya que lee sub del jwt, no user.id del User type
      username: user.username, 
      email: user.email ,
      roles: Array.isArray(user.roles) ? user.roles : [user.roles], //campo distinto al login ya que lee roles del jwt, no Role del user type
      cartId: user.cartId,
      wishlistId: user.wishlistId,
    };
    const tokens = this.getTokens(payload);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return { message: 'Login exitoso'} ;
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
    const {password,createdAt,updatedAt, ...result} = user;
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

      return res.json(payload);
      
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
