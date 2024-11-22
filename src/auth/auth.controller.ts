import { Req, BadRequestException, Body, Controller, Get, Headers, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from "../entities/paris/v1/User";

import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';


import * as dotenv from 'dotenv';
dotenv.config();

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
   

    @Get('is-logged-in')
    async isLoggedIn(@Headers('Authorization') authorizationHeader: string) {
        if (!authorizationHeader) {
            return { isLoggedIn: false };
        }
        return await this.authService.isLoggedIn(authorizationHeader);
    }


    @Post('register')
    register(@Body() body: User) {
        return this.authService.register(body);
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        if(body.email == null || body.email ==='undefined' || body.email ==='')
            throw new BadRequestException('username is required');

        console.log(body.email + ' try to log on');
        return this.authService.login(body.email, body.password);
    }

    @Get('logout')
    logout(@Headers('Authorization') authorizationHeader: string) {

        const msgToReturn = this.authService.logout(authorizationHeader);
        return { message: msgToReturn };
    }

    @Get('me')
    getMe(@Headers('Authorization') authorizationHeader: string) {
        return this.authService.getUserFromToken(authorizationHeader);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        if (!token) {
            throw new BadRequestException('Token is required');
        }
        await this.authService.verifyEmail(token);
        return { message: 'Email successfully verified' };
    }

    // Nouveau endpoint pour vérifier si l'utilisateur est administrateur
    @Get('is-admin')
    async isAdmin(@Headers('Authorization') authorizationHeader: string) {
        console.log("#debug is-admin called");
        if (!authorizationHeader) {
            throw new UnauthorizedException('Token JWT manquant');
        }
        return this.authService.checkIfAdmin(authorizationHeader);
    }


  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route will trigger Google authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { email, username } = req.user;
    let user = await this.authService.findUserByEmail(email);

    if (!user) {
      // Register the new user
      user = await this.authService.registerGoogleUser(email, username);
    }

    // Generate JWT token
    const token = await this.authService.generateToken(user);
    return { accessToken: token };
  }

  @Post('google')
  async authenticateWithGoogle(@Body() body: { credential: string }) {
    const { credential } = body;

    if (!credential) {
      throw new BadRequestException('Google token is required');
    }

    // Validate and process the Google token
    return await this.authService.authenticateGoogleUser(credential);
  }
}
