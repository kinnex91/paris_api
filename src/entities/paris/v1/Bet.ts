// src/entities/Bet.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Match } from './Match';

@Entity()
export class Bet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    predictedScoreA: number;

    @Column()
    predictedScoreB: number;

    @Column({ default: false })
    isExactScore: boolean;

    @Column({ default: 0 })
    pointsEarned: number;

    @ManyToOne(() => User, (user) => user.bets)
    user: User;

    @ManyToOne(() => Match, (match) => match.bets)
    match: Match;
}
