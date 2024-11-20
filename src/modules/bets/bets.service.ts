import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from '../../entities/paris/v1/Bet';
import { Match } from '../../entities/paris/v1/Match';
import { AuthService } from '../../auth/auth.service';
 

/***
 * Modelle de méthode
 *     try{
      const user = await this.validateToken(authorizationHeader); // Validate the token
 * 
 * } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
 * 
 */
@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    private readonly authService: AuthService, // Inject AuthService for token validation
  ) {}

  // Helper Method: Validate Token
  private validateToken(authorizationHeader: string) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Session expired or invalid token');
    }
    const token = authorizationHeader.split(' ')[1]; // Extract the token
    return this.authService.validateToken(token); // Validate the token
  }

  // Create a new bet
  async create(data: Partial<Bet>, authorizationHeader: string) {
    try{
      const user = await this.validateToken(authorizationHeader); // Validate the token


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
  
      data.user = user; // Attach the authenticated user to the bet
  
      console.log(`##debug [${new Date().toISOString()}] User ${user.email} create a bet`);
  
    
      return this.betRepository.save(this.betRepository.create(data));
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

   
   


  }

  // Retrieve all bets
  async findAll(authorizationHeader: string) {

    try{
      const user = await this.validateToken(authorizationHeader); // Validate the token
       
   
    return this.betRepository.find({ relations: ['user', 'match','match.tournament'] }); // Include relations if needed

       } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  

  // Retrieve a single bet by ID
  async findOneById(id: number, authorizationHeader: string) {

    try{
      const user = await this.validateToken(authorizationHeader); // Validate the token
       
    this.validateToken(authorizationHeader); // Validate the token
    const bet = await this.betRepository.findOne({
      where: { id },
      relations: ['user', 'match'], // Include relations if needed
    });

    if (!bet) {
      throw new NotFoundException('Bet not found');
    }

    return bet;
       } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }



  }
}

  // Update a bet (PATCH)
  async update(id: number, data: Partial<Bet>, authorizationHeader: string) {

    try{
      const user = await this.validateToken(authorizationHeader); // Validate the token
       


    await this.validateBetEditable(id); // Ensure the bet can be modified

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

    data.user = user; // Attach the authenticated user to the bet
    console.log(`##debug User ${user.email} edit Bet N° {id}`);
    await this.betRepository.update(id, data);
    return this.findOneById(id, authorizationHeader); // Return the updated bet
       } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  }

  // Delete a bet
  async delete(id: number, authorizationHeader: string) {

    try{
      const user = await this.validateToken(authorizationHeader); // Validate the token
       

   
    console.log(`##debug User ${user.email} delete Bet N° {id}`);

    await this.validateBetEditable(id); // Ensure the bet can be deleted
    const result = await this.betRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Bet not found');
    }
       } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


  }

  // Retrieve bets by user ID
  async findByUserId(userId: number, authorizationHeader: string) {

    try{
      const user = await this.validateToken(authorizationHeader); // Validate the token
       
    this.validateToken(authorizationHeader); // Validate the token
    return this.betRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'match'], // Include user and match relations
    });
       } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }

    }

  }

  // Helper Method: Validate if a bet is editable
  private async validateBetEditable(betId: number): Promise<void> {
    try{
     
      const bet = await this.betRepository.findOne({
        where: { id: betId },
        relations: ['match'], // Include match relation to check the date
      });
  
      if (!bet) {
        throw new NotFoundException('Bet not found');
      }
  
      if (new Date(bet.match.dateMatch) < new Date()) {
        throw new ForbiddenException('Cannot modify a bet for a match that has already occurred');
      }
    
       } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Specific handling for UnauthorizedException
        throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        // Generic handling for other exceptions
        console.error(`Unhandled exception: ${error.message}`, error.stack); // Log for debugging
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }

    }

  }
}
