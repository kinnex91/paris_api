// src/modules/configurations/configurations.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post()
  create(@Body() data: any) {
    return this.configurationsService.create(data);
  }

  @Get()
  findAll() {
    return this.configurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.configurationsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.configurationsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.configurationsService.delete(id);
  }
}
