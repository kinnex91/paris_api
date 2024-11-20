import { Match } from '../entities/paris/v1/Match';

import { User } from '../entities/paris/v1/User';

export class PublicBet {
  id: number;
  predictedScoreA: number;
  predictedScoreB: number;
  isExactScore: boolean;
  pointsEarned: number;
  match: Match;
  user: User;

}
