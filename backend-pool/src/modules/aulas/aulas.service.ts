import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async validateProfessor(professorId: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: professorId } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${professorId} (professorId) não encontrado.`);
    }

    if (user.role !== UserRole.PROFESSOR) {
      throw new BadRequestException(
        `O usuário "${user.name}" não possui permissão de PROFESSOR (Role atual: ${user.role}).`,
      );
    }
  }

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
    const { ingredientIds, professorId, ...rest } = createAulaDto;

    await this.validateProfessor(professorId);

    const ingredients = await this.resolveIngredients(ingredientIds);

    const aula = this.aulasRepository.create({ ...rest, professorId, ingredients });
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
    const { ingredientIds, professorId, ...rest } = updateAulaDto;

    // CRITÉRIO DE ACEITE: Se o professorId foi enviado no PATCH, valida a existência e a role
    if (professorId) {
      await this.validateProfessor(professorId);
      aula.professorId = professorId;
    }

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
