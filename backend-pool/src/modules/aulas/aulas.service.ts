import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { AulaIngredient } from './entities/aula-ingredient.entity';
import { CreateIngredientDto } from '../ingredients/dto/create-ingredient.dto';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,
    
    @InjectRepository(AulaIngredient)
    private aulaIngredientRepository: Repository<AulaIngredient>,
  ) {}

  // CREATE AULA
  async create(createAulaDto: CreateAulaDto) {
    const aula = this.aulasRepository.create(createAulaDto);
    return await this.aulasRepository.save(aula);
  }

  // aqui ta vinculando o ingrediente a aula
  async addIngredient(aulaId: number, createIngredientDto: CreateIngredientDto) {
    const aula = await this.findOne(aulaId);

    const novoVinculo = this.aulaIngredientRepository.create({
      aula: { id: aula.id }, 
      inventoryItem: { id: createIngredientDto.itemId }, 
      quantity: createIngredientDto.quantity,
      unit: createIngredientDto.unit
    });

    return await this.aulaIngredientRepository.save(novoVinculo);
  }

  // READ all
  async findAll() {
    return await this.aulasRepository.find({ order: { name: 'ASC' } });
  }

  // READ por id
  async findOne(id: number) {
    const aula = await this.aulasRepository.findOne({ where: { id } });
    if (!aula) {
      throw new NotFoundException(`Aula com ID ${id} não encontrada.`);
    }
    return aula;
  }

  // UPDATE
  async update(id: number, updateAulaDto: UpdateAulaDto) {
    const aula = await this.findOne(id);
    this.aulasRepository.merge(aula, updateAulaDto);
    return await this.aulasRepository.save(aula);
  }

  // DELETE
  async remove(id: number) {
    const aula = await this.findOne(id);
    return await this.aulasRepository.remove(aula);
  }
}