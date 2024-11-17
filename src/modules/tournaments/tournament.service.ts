// src/modules/tournaments/tournament.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../entities/paris/v1/Tournament';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return await this.tournamentRepository.find();
  }

  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament;
  }

  async create(tournament: Partial<Tournament>): Promise<Tournament> {
    const newTournament = this.tournamentRepository.create(tournament);
    return await this.tournamentRepository.save(newTournament);
  }

  async update(id: number, updatedData: Partial<Tournament>): Promise<Tournament> {
    const tournament = await this.findOne(id);
    Object.assign(tournament, updatedData);
    return await this.tournamentRepository.save(tournament);
  }

  async delete(id: number): Promise<void> {
    const result = await this.tournamentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Tournament not found');
    }
  }
}
