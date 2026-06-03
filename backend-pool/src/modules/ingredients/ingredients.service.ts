import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  // CREATE
  async create(createIngredientDto: CreateIngredientDto) {
    const ingredient = this.ingredientsRepository.create(createIngredientDto);
    return await this.ingredientsRepository.save(ingredient);
  }

  // READ all
  async findAll() {
    return await this.ingredientsRepository.find({ order: { name: 'ASC' } });
  }

  // READ por id
  async findOne(id: number) {
    const ingredient = await this.ingredientsRepository.findOne({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado.`);
    }
    return ingredient;
  }

  // UPDATE
  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    this.ingredientsRepository.merge(ingredient, updateIngredientDto);
    return await this.ingredientsRepository.save(ingredient);
  }

  // DELETE
  async remove(id: number) {
    const ingredient = await this.findOne(id);
    return await this.ingredientsRepository.remove(ingredient);
  }
}