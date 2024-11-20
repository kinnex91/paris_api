import { Bet } from '../entities/paris/v1/Bet';

export type User = {
  id: number;
  username: string | null;
  email: string;
  isEmailVerified: boolean;
  isValidated: boolean;
  isAdmin: boolean;
  totalPoints: number;
  emailVerificationToken: string | null;
  bets: Bet[];
  inscriptionDateTimeInLong: number;
  lastLoginDate: Date | null;
};
