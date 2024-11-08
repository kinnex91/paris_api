// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { ChampionshipDaysModule } from './modules/championshipDays/championshipDays.module';
import { MatchesModule } from './modules/matches/matches.module';
import { BetsModule } from './modules/bets/bets.module';
import { ConfigurationsModule } from './modules/configurations/configurations.module';

@Module({
  imports: [
  
    // Charger les variables d'environnement depuis le fichier .env
    ConfigModule.forRoot({
      isGlobal: true, // Rendre le module Config accessible partout
    }),
	
	
    // Configuration de la connexion à la base de données
    TypeOrmModule.forRoot({
      type: 'mysql', // Type de base de données (ex: postgres, sqlite, etc.)
	  
	  host: process.env.DB_HOST,
	  port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
	  
	  
      entities: [__dirname + '/entities/paris/v1/*.{ts,js}'], // Chemin vers les entités
      synchronize: true, // Synchroniser les entités avec la base (désactiver en production)
    }),

    // Importation des modules
    UsersModule,
    TournamentsModule,
    ChampionshipDaysModule,
    MatchesModule,
    BetsModule,
    ConfigurationsModule,
  ],
})
export class AppModule {}
