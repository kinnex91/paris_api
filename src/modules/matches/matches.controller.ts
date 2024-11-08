// src/users/users.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from '../../entities/paris/v1/Match';


@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() data: any) {
    return this.matchesService.create(data);
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.matchesService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.matchesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.matchesService.delete(id);
  }
}
