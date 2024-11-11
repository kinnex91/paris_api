// src/entities/paris/v1/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
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

  // Cette colonne servira pour la sécurité, si trop d'inscription sont faite sur un temps court exemple 3 de suite en moins de 10 secondes, on bloquera la fonction d'envoie de mail pendant 2 heures dans le service
  @Column({ type: 'bigint', nullable: false })
  inscriptionDateTimeInLong: number;

  @BeforeInsert()
  setInscriptionDateTimeInLong() {
    this.inscriptionDateTimeInLong = (Date.now() / 1000); // La date d'inscription en secondes.
  }
}
