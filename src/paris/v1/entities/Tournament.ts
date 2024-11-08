// src/entities/Tournament.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChampionshipDay } from './ChampionshipDay';
import { Configuration } from './Configuration';

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sportCategory: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @OneToMany(() => ChampionshipDay, (day) => day.tournament)
    championshipDays: ChampionshipDay[];

    @OneToMany(() => Configuration, (config) => config.tournament)
    configurations: Configuration[];
}
