import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  create(@Body() data: any) {
    return this.tournamentsService.create(data);
  }

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tournamentsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.tournamentsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.tournamentsService.delete(id);
  }
}
