// src/modules/bets/bets.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BetsService } from './bets.service';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  create(@Body() data: any) {
    return this.betsService.create(data);
  }

  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.betsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.betsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.betsService.delete(id);
  }
}
