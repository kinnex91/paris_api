import { Controller, Get, Post, Patch, Delete, Param, Body, Headers } from '@nestjs/common';
import { BetsService } from './bets.service';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { InactivityMiddleware } from '../../middlewares/inactivity.middleware';
import { PublicBet} from '../../type/PublicBet';

@Controller('bets')
export class BetsController {
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InactivityMiddleware).forRoutes('*'); // Apply to `bets` routes only
  }
  constructor(private readonly betsService: BetsService) {}

  @Post()
  create(@Body() data: any, @Headers('Authorization') authorizationHeader: string) {
    return this.betsService.create(data, authorizationHeader);
  }

  @Get()
  findAll(@Headers('Authorization') authorizationHeader: string) {
    return this.betsService.findAll(authorizationHeader);
  }

  @Get('user/:id')
  findAllForUser(@Param('id') id: number, @Headers('Authorization') authorizationHeader: string) {
    return this.betsService.findByUserId(id, authorizationHeader);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Headers('Authorization') authorizationHeader: string) {
    return this.betsService.findOneById(id, authorizationHeader);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: any,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.betsService.update(id, data, authorizationHeader);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Headers('Authorization') authorizationHeader: string) {
    return this.betsService.delete(id, authorizationHeader);
  }


}
