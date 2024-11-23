import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomUnauthorizedException extends HttpException {
  constructor(message: string) {
    super({ statusCode: HttpStatus.UNAUTHORIZED, message }, HttpStatus.UNAUTHORIZED);
  }
}
