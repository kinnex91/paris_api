// src/modules/championshipDays/championshipDays.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ChampionshipDaysService } from './championshipDays.service';

@Controller('championship-days')
export class ChampionshipDaysController {
  constructor(private readonly championshipDaysService: ChampionshipDaysService) {}

  @Post()
  create(@Body() data: any) {
    return this.championshipDaysService.create(data);
  }

  @Get()
  findAll() {
    return this.championshipDaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.championshipDaysService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.championshipDaysService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.championshipDaysService.delete(id);
  }
}
