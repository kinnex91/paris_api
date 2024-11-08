// src/entities/Match.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChampionshipDay } from './ChampionshipDay';
import { Bet } from './Bet';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    teamA: string;

    @Column()
    teamB: string;

    @Column({ nullable: true })
    finalScoreA: number;

    @Column({ nullable: true })
    finalScoreB: number;

    @ManyToOne(() => ChampionshipDay, (day) => day.matches)
    championshipDay: ChampionshipDay;

    @OneToMany(() => Bet, (bet) => bet.match)
    bets: Bet[];
}
