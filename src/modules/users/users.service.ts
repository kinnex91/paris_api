// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/paris/v1/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Créer un utilisateur
  async createUser(username: string, password: string, email: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      password,
      email,
      hashGuidValidatedEmail: this.generateGuid(),
    });
    return this.userRepository.save(user);
  }

  // Générer un GUID pour valider l'email
  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Récupérer un utilisateur par ID
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${id} introuvable`);
    }
    return user;
  }

  // Mettre à jour un utilisateur
  async updateUser(
    id: number,
    username?: string,
    password?: string,
    email?: string,
    isValidated?: boolean,
    isAdmin?: boolean,
  ): Promise<User> {
    const user = await this.findOneById(id);
    if (username) user.username = username;
    if (password) user.password = password;
    if (email) user.email = email;
    if (isValidated !== undefined) user.isValidated = isValidated;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    return this.userRepository.save(user);
  }

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec ID ${id} introuvable`);
    }
  }
}
