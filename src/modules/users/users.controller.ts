// src/users/users.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '../../entities/paris/v1/User';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Créer un utilisateur
  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ): Promise<User> {
    return this.userService.createUser(username, password, email);
  }

  // Récupérer tous les utilisateurs
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Récupérer un utilisateur par ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  // Mettre à jour un utilisateur
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('isValidated') isValidated: boolean,
    @Body('isAdmin') isAdmin: boolean,
  ): Promise<User> {
    return this.userService.updateUser(id, username, password, email, isValidated, isAdmin);
  }

  // Supprimer un utilisateur
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
