// src/modules/tournaments/tournament.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Tournament } from '../../entities/paris/v1/Tournament';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  async findAll(): Promise<Tournament[]> {
    return await this.tournamentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Tournament> {
    return await this.tournamentService.findOne(id);
  }

  @Post()
  async create(@Body() tournament: Partial<Tournament>): Promise<Tournament> {
    return await this.tournamentService.create(tournament);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedData: Partial<Tournament>,
  ): Promise<Tournament> {
    return await this.tournamentService.update(id, updatedData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.tournamentService.delete(id);
    return { message: 'Tournament deleted successfully' };
  }
}
