import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicBet} from '../../type/PublicBet';
import { Match } from '../../entities/paris/v1/Match';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(PublicBet)
    private readonly betRepository: Repository<PublicBet>,
    private readonly authService: AuthService,
  ) {}

  // Helper Method: Validate Token
  private async validateToken(authorizationHeader: string) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Session expired or invalid token');
    }
    const token = authorizationHeader.split(' ')[1];
    return this.authService.validateToken(token);
  }

  // Helper Method: Validate User Ownership of a Bet
  private async validateBetOwnership(betId: number, userId: number): Promise<PublicBet> {
    const bet = await this.betRepository.findOne({
      where: { id: betId },
      relations: ['user'], // Include user to check ownership
    });

    if (!bet) {
      throw new NotFoundException('Bet not found');
    }

    if (bet.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to access this bet');
    }

    return bet;
  }

  // Create a new bet
  async create(data: Partial<PublicBet>, authorizationHeader: string) {
    try {
      const user = await this.validateToken(authorizationHeader);

      if (!data.match || !data.match.id) {
        throw new NotFoundException('Match information is missing or invalid');
      }

      const match = await this.betRepository.manager.findOne(Match, {
        where: { id: data.match.id },
      });

      if (!match) {
        throw new NotFoundException('Match not found');
      }

      if (new Date(match.dateMatch) < new Date()) {
        throw new ForbiddenException('Cannot create a bet for a match that has already occurred');
      }

      data.user = user;

      console.log(`##debug [${new Date().toISOString()}] User ${user.email} created a bet`);

      return this.betRepository.save(this.betRepository.create(data));
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Retrieve all bets
  async findAll(authorizationHeader: string) {
    try {
      await this.validateToken(authorizationHeader);

      return this.betRepository.find({
        relations: ['user', 'match', 'match.tournament'],
      });
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Retrieve a single bet by ID
  async findOneById(id: number, authorizationHeader: string) {
    try {
      const user = await this.validateToken(authorizationHeader);
      const bet = await this.validateBetOwnership(id, user.id);

      return bet;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Update a bet
  async update(id: number, data: Partial<PublicBet>, authorizationHeader: string) {
    try {
      const user = await this.validateToken(authorizationHeader);
      const bet = await this.validateBetOwnership(id, user.id);

      await this.validateBetEditable(bet.id);

      if (data.match && data.match.id) {
        const match = await this.betRepository.manager.findOne(Match, {
          where: { id: data.match.id },
        });

        if (!match) {
          throw new NotFoundException('Match not found');
        }

        if (new Date(match.dateMatch) < new Date()) {
          throw new ForbiddenException('Cannot update a bet for a match that has already occurred');
        }
      }

      data.user = user;
      console.log(`##debug User ${user.email} edited Bet N° ${id}`);
      await this.betRepository.update(id, data);

      return this.findOneById(id, authorizationHeader);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Delete a bet
  async delete(id: number, authorizationHeader: string) {
    try {
      const user = await this.validateToken(authorizationHeader);
      const bet = await this.validateBetOwnership(id, user.id);

      await this.validateBetEditable(bet.id);

      console.log(`##debug User ${user.email} deleted Bet N° ${id}`);

      const result = await this.betRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Bet not found');
      }
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Retrieve bets by user ID
  async findByUserId(userId: number, authorizationHeader: string) {
    try {
      const user = await this.validateToken(authorizationHeader);

      if (user.id !== userId) {
        throw new ForbiddenException('You do not have permission to access these bets');
      }

      return this.betRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'match'],
      });
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Validate if a bet is editable
  private async validateBetEditable(betId: number): Promise<void> {
    const bet = await this.betRepository.findOne({
      where: { id: betId },
      relations: ['match'],
    });

    if (!bet) {
      throw new NotFoundException('Bet not found');
    }

    if (new Date(bet.match.dateMatch) < new Date()) {
      throw new ForbiddenException('Cannot modify a bet for a match that has already occurred');
    }
  }

  // Handle errors for better debugging and user feedback
  private handleServiceError(error: any): never {
    if (error instanceof UnauthorizedException) {
      throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
    } else {
      console.error(`Unhandled exception: ${error.message}`, error.stack);
      throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
