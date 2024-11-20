import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class InactivityMiddleware implements NestMiddleware {

    
    private readonly jwtSecret = "" + process.env.SECRET

  use(req: any, res: any, next: () => void) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
    }

    const token = authorizationHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      // Check inactivity by comparing the current time with the `iat` or `exp` claim
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const inactivityLimit = 5 * 60; // 5 minutes in seconds

      if (decoded.iat && currentTime - decoded.iat > inactivityLimit) {
        throw new UnauthorizedException('Token expired due to inactivity');
      }

      // Optionally update the token's `iat` to reset inactivity
      decoded.iat = currentTime;
      req.user = decoded;

      next();
    } catch (err) {
      throw new HttpException('Session expired or invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
