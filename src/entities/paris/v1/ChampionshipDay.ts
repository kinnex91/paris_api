// src/entities/ChampionshipDay.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Match } from './Match';

@Entity()
export class ChampionshipDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @ManyToOne(() => Tournament, (tournament) => tournament.championshipDays)
    tournament: Tournament;

  
}
