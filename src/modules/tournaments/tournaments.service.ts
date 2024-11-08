import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../entities/paris/v1/Tournament';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepo: Repository<Tournament>,
  ) {}

  async create(data: Partial<Tournament>) {
    return this.tournamentRepo.save(this.tournamentRepo.create(data));
  }

  async findAll() {
    return this.tournamentRepo.find();
  }

  async findOneById(id: number) {
    const tournament = await this.tournamentRepo.findOne({ where: { id } });
    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async update(id: number, data: Partial<Tournament>) {
    await this.tournamentRepo.update(id, data);
    return this.findOneById(id);
  }

  async delete(id: number) {
    const result = await this.tournamentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Tournament not found');
  }
}
