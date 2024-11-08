// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './paris/v1/entities/User';
import { Tournament } from './paris/v1/entities/Tournament';
import { ChampionshipDay } from './paris/v1/entities/ChampionshipDay';
import { Match } from './paris/v1/entities/Match';
import { Bet } from './paris/v1/entities/Bet';
import { Configuration } from './paris/v1/entities/Configuration';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
		      type: 'mysql',
      host: 'localhost',
      port: 23307,
      username: 'root',
      password: 'rootROOTROOT66',
      database: 'base2',
      entities: ['src/../**/*.entity.js'],  
      database: 'sports_betting',
	  entities: [__dirname + '/paris/v1/entities/*.{ts,js}'],
      synchronize: true, // Désactiver en production !
    }),
    TypeOrmModule.forFeature([
      User,
      Tournament,
      ChampionshipDay,
      Match,
      Bet,
      Configuration,
    ]),
	 UsersModule,
  ],

})
export class AppModule {}
