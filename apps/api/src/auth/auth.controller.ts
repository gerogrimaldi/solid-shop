import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
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
