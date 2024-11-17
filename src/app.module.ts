import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';

import { TournamentModule } from './modules/tournaments/tournament.module';
import { ChampionshipDaysModule } from './modules/championshipDays/championshipDays.module';
import { MatchesModule } from './modules/matches/matches.module';
import { BetsModule } from './modules/bets/bets.module';
import { ConfigurationsModule } from './modules/configurations/configurations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/entities/paris/v1/**/**.{ts,js}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),

    AuthModule,
    TournamentModule,
    ChampionshipDaysModule,
    MatchesModule,
    BetsModule,
    ConfigurationsModule,
  ],
})
export class AppModule {}
