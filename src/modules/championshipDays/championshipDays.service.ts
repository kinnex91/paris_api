// src/modules/championshipDays/championshipDays.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChampionshipDay } from '../../entities/paris/v1/ChampionshipDay';

@Injectable()
export class ChampionshipDaysService {
  constructor(
    @InjectRepository(ChampionshipDay)
    private readonly championshipDayRepo: Repository<ChampionshipDay>,
  ) {}

  async create(data: Partial<ChampionshipDay>) {
    return this.championshipDayRepo.save(this.championshipDayRepo.create(data));
  }

  async findAll() {
    return this.championshipDayRepo.find();
  }

  async findOneById(id: number) {
    const day = await this.championshipDayRepo.findOne({ where: { id } });
    if (!day) throw new NotFoundException('Championship Day not found');
    return day;
  }

  async update(id: number, data: Partial<ChampionshipDay>) {
    await this.championshipDayRepo.update(id, data);
    return this.findOneById(id);
  }

  async delete(id: number) {
    const result = await this.championshipDayRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Championship Day not found');
  }
}
