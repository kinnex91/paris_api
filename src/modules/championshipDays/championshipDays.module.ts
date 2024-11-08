// src/modules/championshipDays/championshipDays.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampionshipDay } from '../../entities/paris/v1/ChampionshipDay';
import { ChampionshipDaysService } from './championshipDays.service';
import { ChampionshipDaysController } from './championshipDays.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChampionshipDay])],
  controllers: [ChampionshipDaysController],
  providers: [ChampionshipDaysService],
})
export class ChampionshipDaysModule {}
