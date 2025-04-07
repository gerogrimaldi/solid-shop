import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login') //no se usa dto porque local-auth.guard ya lo valida, y el usuario se inyecta en req.user
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) { //recibo res para las cookies
    return this.authService.login(req.user, res);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) { //recibo res para las cookies
    console.log("request user in controller: ", req.user)
    return this.authService.refreshToken(req.user, res);
  }

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  updateUser(@Param('id') id: string, @Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.updateUser(id, registerAuthDto);
  }
  
  @Get('verify')
  async verifyToken(@Req() req, @Res() res: Response){
    return this.authService.verifyToken(req, res);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
