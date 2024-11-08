// src/modules/configurations/configurations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from '../../entities/paris/v1/Configuration';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configRepo: Repository<Configuration>,
  ) {}

  async create(data: Partial<Configuration>) {
    return this.configRepo.save(this.configRepo.create(data));
  }

  async findAll() {
    return this.configRepo.find();
  }

  async findOneById(id: number) {
    const config = await this.configRepo.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuration not found');
    return config;
  }

  async update(id: number, data: Partial<Configuration>) {
    await this.configRepo.update(id, data);
    return this.findOneById(id);
  }

  async delete(id: number) {
    const result = await this.configRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Configuration not found');
  }
}
