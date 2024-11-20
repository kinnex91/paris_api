// src/users/users.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ForbiddenException } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '../../entities/paris/v1/User';
import { PublicUser } from '../../type/PublicUser';

@Controller('usersNotStandartRoot')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Créer un utilisateur
  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ): Promise<User> {
    return this.userService.createUser(email, password);
  }

  // Récupérer tous les utilisateurs
  @Get('all')
  async getAllUsers(): Promise<PublicUser[]> {
    return this.userService.findAllWithoutPassword();
  }

  // Récupérer un utilisateur par ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<PublicUser> {
    return this.userService.findOneByIdWithoutPassword(id);
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
  @Delete(':idProtectedDeletion465465654489')
  async deleteUser(@Param('id') id: number): Promise<void> {
    console.log("### Fatal but not compromise : a try to delete with secret root as been called in this jwt protected api");
    throw new ForbiddenException
    //await this.userService.deleteUser(id);
  }
}
