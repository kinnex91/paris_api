// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/paris/v1/User';
import { Tournament } from './entities/paris/v1/Tournament';
import { ChampionshipDay } from './entities/paris/v1/ChampionshipDay';
import { Match } from './entities/paris/v1/Match';
import { Bet } from './entities/paris/v1/Bet';
import { Configuration } from './entities/paris/v1/Configuration';

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
	  entities: [__dirname + '/entities/paris/v1/*.{ts,js}'],
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
