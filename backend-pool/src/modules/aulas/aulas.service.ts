import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  private async resolveIngredients(ids: number[]): Promise<Ingredient[]> {
    const ingredients = await this.ingredientsRepository.findBy({ id: In(ids) });

    const foundIds = ingredients.map((i) => i.id);
    const missing = ids.filter((id) => !foundIds.includes(id));
    if (missing.length > 0) {
      throw new NotFoundException(
        `Ingredientes com IDs [${missing.join(', ')}] não encontrados.`,
      );
    }

    return ingredients;
  }

  // CREATE
  async create(createAulaDto: CreateAulaDto) {
    const { ingredientIds, ...rest } = createAulaDto;
    const ingredients = await this.resolveIngredients(ingredientIds);

    const aula = this.aulasRepository.create({ ...rest, ingredients });
    return await this.aulasRepository.save(aula);
  }

  // READ all
  async findAll() {
    return await this.aulasRepository.find({ order: { date: 'ASC' } });
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
    const { ingredientIds, ...rest } = updateAulaDto;

    this.aulasRepository.merge(aula, rest);

    if (ingredientIds) {
      aula.ingredients = await this.resolveIngredients(ingredientIds);
    }

    return await this.aulasRepository.save(aula);
  }

  // DELETE
  async remove(id: number) {
    const aula = await this.findOne(id);
    return await this.aulasRepository.remove(aula);
  }
}
