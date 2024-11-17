// src/modules/tournaments/tournament.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { Tournament } from '../../entities/paris/v1/Tournament';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
