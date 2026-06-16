import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.ingredientsRepository.find({
      order: { name: 'ASC' },
    });
  }

  // READ por id
  async findOne(id: number) {
    const ingredient = await this.ingredientsRepository.findOne({
      where: { id },
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

  // DELETE — remove o ingrediente, bloqueando se estiver vinculado a alguma aula
  async remove(id: number): Promise<{ message: string; ingredientId: number }> {
    const ingredient = await this.ingredientsRepository.findOne({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado.`);
    }

    const vinculo = await this.aulaIngredientRepository.findOne({
      where: { itemId: id },
      relations: ['aula'],
    });

    if (vinculo) {
      throw new ConflictException(
        `Este ingrediente não pode ser excluído porque a aula "${vinculo.aula.name}" está requisitando-o.`,
      );
    }

    await this.ingredientsRepository.remove(ingredient);
    return { message: 'Ingrediente removido com sucesso.', ingredientId: id };
  }
}