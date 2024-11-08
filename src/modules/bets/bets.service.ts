// src/modules/bets/bets.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from '../../entities/paris/v1/Bet';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
  ) {}

  async create(data: Partial<Bet>) {
    return this.betRepository.save(this.betRepository.create(data));
  }

  async findAll() {
    return this.betRepository.find();
  }

  async findOneById(id: number) {
    const bet = await this.betRepository.findOne({ where: { id } });
    if (!bet) throw new NotFoundException('Bet not found');
    return bet;
  }

  async update(id: number, data: Partial<Bet>) {
    await this.betRepository.update(id, data);
    return this.findOneById(id);
  }

  async delete(id: number) {
    const result = await this.betRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Bet not found');
  }
}
