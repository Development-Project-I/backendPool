import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { AulaIngredient } from '../aulas/entities/aula-ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,

    @InjectRepository(AulaIngredient)
    private aulaIngredientRepository: Repository<AulaIngredient>,
  ) {}

  // CREATE
  async create(createIngredientDto: CreateIngredientDto) {
    const ingredient = this.ingredientsRepository.create(createIngredientDto);
    return await this.ingredientsRepository.save(ingredient);
  }

  // READ all
  async findAll() {
    // CORREÇÃO: Seleciona o ingrediente trazendo apenas as colunas seguras da Aula (evita quebrar por date/turma inexistentes)
    return await this.ingredientsRepository.find({
      relations: {
        aulas: true,
      },
      select: {
        id: true,
        name: true,
        unit: true,
        category: true,
        aulas: {
          id: true,
          name: true,
        },
      },
      order: { name: 'ASC' },
    });
  }

  // READ por id
  async findOne(id: number) {
    // CORREÇÃO: Busca o ingrediente específico mapeando estritamente os campos físicos existentes
    const ingredient = await this.ingredientsRepository.findOne({
      where: { id },
      relations: {
        aulas: true,
      },
      select: {
        id: true,
        name: true,
        unit: true,
        category: true,
        aulas: {
          id: true,
          name: true,
        },
      },
    });

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

  // DELETE — remove o vínculo aula↔ingrediente (aula_ingredients)
  async remove(id: number): Promise<{ message: string; ingredientId: number }> {
    const aulaIngredient = await this.aulaIngredientRepository.findOne({ where: { id } });
    if (!aulaIngredient) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado.`);
    }
    await this.aulaIngredientRepository.remove(aulaIngredient);
    return { message: 'Ingrediente removido da aula.', ingredientId: id };
  }
}