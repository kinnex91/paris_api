// src/modules/bets/bets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from '../../entities/paris/v1/Bet';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bet])],
  controllers: [BetsController],
  providers: [BetsService],
})
export class BetsModule {}
