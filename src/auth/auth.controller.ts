import { BadRequestException, Body, Controller, Get, Headers, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from "../entities/paris/v1/User";
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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
    login(@Body() body: { username: string; password: string }) {
        return this.authService.login(body.username, body.password);
    }

    @Get('me')
    createRecipe(@Headers('Authorization') authorizationHeader: string) {
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
}
