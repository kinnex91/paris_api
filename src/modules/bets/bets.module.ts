import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from '../../entities/paris/v1/Bet';
import { AuthModule } from '../../auth/auth.module'; // Import AuthModule
import { AuthService } from '../../auth/auth.service';
import { InactivityMiddleware } from '../../middlewares/inactivity.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet]), // Register Bet entity
    AuthModule, // Import AuthModule to access AuthService
  ],
  controllers: [BetsController],
  providers: [BetsService],
})
export class BetsModule {}
