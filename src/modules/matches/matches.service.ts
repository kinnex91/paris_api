// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../entities/paris/v1/Match';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  async create(data: Partial<Match>) {
    return this.matchRepo.save(this.matchRepo.create(data));
  }

  async findAll() {
    return this.matchRepo.find();
  }

  async findOneById(id: number) {
    const match = await this.matchRepo.findOne({ where: { id } });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async update(id: number, data: Partial<Match>) {
    await this.matchRepo.update(id, data);
    return this.findOneById(id);
  }

  async delete(id: number) {
    const result = await this.matchRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Match not found');
  }
}
