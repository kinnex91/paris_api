import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeUpdate } from 'typeorm';
import { User } from './User';
import { Match } from './Match';

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  predictedScoreA: number;

  @Column({ default: 0 })
  predictedScoreB: number;

  @Column({ default: false })
  isExactScore: boolean;

  @Column({ default: 0 })
  pointsEarned: number;

  @ManyToOne(() => User, (user) => user.bets)
  user: User;

  @ManyToOne(() => Match, (match) => match.bets)
  match: Match;

  @Column({ default: false })
  hasBeenPatched: boolean;

  @BeforeUpdate()
  updateHasBeenPatched() {
    this.hasBeenPatched = true;
  }
}
