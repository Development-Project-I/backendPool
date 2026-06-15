import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const existing = await this.ingredientsRepository.findOne({
      where: { name: createIngredientDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Ingrediente "${createIngredientDto.name}" já está cadastrado.`,
      );
    }

    const newIngredient = this.ingredientsRepository.create(createIngredientDto);
    return await this.ingredientsRepository.save(newIngredient);
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

  // DELETE
  async remove(id: number) {
    const ingredient = await this.findOne(id);
    return await this.ingredientsRepository.remove(ingredient);
  }
}
