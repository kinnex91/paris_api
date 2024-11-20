// src/entities/Match.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Timestamp } from 'typeorm';
import { ChampionshipDay } from './ChampionshipDay';
import { Bet } from './Bet';
import { Tournament } from './Tournament';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    teamA: string;

    @Column()
    teamB: string;

    @Column({ nullable: true , default:null })
    finalScoreA: number;

    @Column({ nullable: true, default:null  })
    finalScoreB: number;

    @Column()
    quoteTeamA: number;

    @Column()
    quoteTeamB: number;

    @Column({ type: 'timestamp' })
    dateMatch: Date;

    @OneToMany(() => Bet, (bet) => bet.match)
    bets: Bet[];

    @ManyToOne(() => Tournament, (tournament) => tournament.matchs)
    tournament: Tournament;
}
