// src/entities/paris/v1/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bet } from './Bet';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true , default:null })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  isEmailVerified: boolean;

  @Column({ default: false })
  isValidated: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 0 })
  totalPoints: number;

  @Column({ nullable: true })
  emailVerificationToken: string;
  

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];
}
