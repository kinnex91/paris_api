// src/entities/Match.ts
import { Entity, BeforeInsert,PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Timestamp } from 'typeorm';
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

    @BeforeInsert()
  async setDefaultTournament() {
    if (!this.tournament) {
      this.tournament = new Tournament();
      this.tournament.id = 1; // Set default tournament with id = 1
    }
  }
}
