// src/entities/Configuration.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tournament } from './Tournament';

@Entity()
export class Configuration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pointsForWin: number;

    @Column()
    pointsForLoss: number;

    @Column()
    pointsForExactScore: number;

    @ManyToOne(() => Tournament, (tournament) => tournament.configurations)
    tournament: Tournament;
}
