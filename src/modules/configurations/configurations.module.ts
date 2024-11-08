// src/modules/configurations/configurations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../../entities/paris/v1/Configuration';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsController } from './configurations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
})
export class ConfigurationsModule {}
