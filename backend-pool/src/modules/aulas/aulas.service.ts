import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula, AulaStatus } from './entities/aula.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { AulaIngredient } from './entities/aula-ingredient.entity';
import { CreateIngredientDto } from '../ingredients/dto/create-ingredient.dto';
import { InventoryItem } from '../inventory/entities/inventory.entity';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,

    @InjectRepository(AulaIngredient)
    private aulaIngredientRepository: Repository<AulaIngredient>,

    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  // CREATE AULA
  async create(createAulaDto: CreateAulaDto) {
    const { dayOfWeek, time } = createAulaDto;
    if (dayOfWeek && time) {
      const existing = await this.aulasRepository.findOne({ where: { dayOfWeek, time } });
      if (existing) {
        throw new ConflictException(`Já existe uma aula agendada para ${dayOfWeek} às ${time}.`);
      }
    }
    const aula = this.aulasRepository.create(createAulaDto);
    return await this.aulasRepository.save(aula);
  }

  // aqui ta vinculando o ingrediente a aula
  async addIngredient(aulaId: number, createIngredientDto: CreateIngredientDto) {
    const aula = await this.findRawEntity(aulaId);

    // busca o item do estoque para salvar o snapshot
    const invItem = await this.inventoryRepository.findOne({
      where: { id: createIngredientDto.itemId },
    });

    const novoVinculo = new AulaIngredient();
    novoVinculo.aula = aula;
    novoVinculo.inventoryItem = invItem ?? null;
    novoVinculo.itemId = createIngredientDto.itemId;
    if (invItem) {
      novoVinculo.name = invItem.name;
      novoVinculo.category = invItem.category;
    }
    novoVinculo.quantity = createIngredientDto.quantity;
    novoVinculo.unit = createIngredientDto.unit;

    return await this.aulaIngredientRepository.save(novoVinculo);
  }

  // busca a entidade Aula crua (sem enriquecimento) — uso interno
  private async findRawEntity(id: number): Promise<Aula> {
    const aula = await this.aulasRepository.findOne({ where: { id } });
    if (!aula) {
      throw new NotFoundException(`Aula com ID ${id} não encontrada.`);
    }
    return aula;
  }

  // READ all
  async findAll() {
    const aulas = await this.aulasRepository.find({
      relations: ['aulaIngredients', 'aulaIngredients.inventoryItem'],
      order: { name: 'ASC' },
    });
    return aulas.map((aula) => this.enrichAula(aula));
  }

  // READ por id
  async findOne(id: number) {
    const aula = await this.aulasRepository.findOne({
      where: { id },
      relations: ['aulaIngredients', 'aulaIngredients.inventoryItem'],
    });
    if (!aula) {
      throw new NotFoundException(`Aula com ID ${id} não encontrada.`);
    }
    return this.enrichAula(aula);
  }

  // monta o objeto de resposta com inventoryItems enriquecidos
  private enrichAula(aula: Aula) {
    const { aulaIngredients, ...aulaData } = aula;
    return {
      ...aulaData,
      inventoryItems: this.buildInventoryItems(aulaIngredients ?? []),
    };
  }

  private buildInventoryItems(aulaIngredients: AulaIngredient[]) {
    return aulaIngredients.map((ai) => {
      const inv = ai.inventoryItem;
      const available = inv ? inv.quantity : 0;
      const required = ai.quantity;

      let stockStatus: 'OK' | 'BAIXO' | 'SEM_ESTOQUE';
      if (available <= 0) {
        stockStatus = 'SEM_ESTOQUE';
      } else if (available < required) {
        stockStatus = 'BAIXO';
      } else {
        stockStatus = 'OK';
      }

      return {
        ingredientId: ai.id,
        itemId: inv ? inv.id : ai.itemId,
        name: inv ? inv.name : (ai.name ?? `Item #${ai.itemId}`),
        category: inv ? inv.category : (ai.category ?? '—'),
        requiredQuantity: ai.quantity,
        requiredUnit: ai.unit,
        availableQuantity: available,
        stockUnit: inv ? inv.unit : ai.unit,
        minStock: inv ? inv.minStock : 0,
        expiryDate: inv ? inv.expiryDate : undefined,
        batchNumber: inv ? inv.batchNumber : undefined,
        stockStatus,
        itemInInventory: inv !== null,
      };
    });
  }

  // UPDATE
  async update(id: number, updateAulaDto: UpdateAulaDto) {
    const aula = await this.aulasRepository.findOne({ where: { id } });
    if (!aula) {
      throw new NotFoundException(`Aula com ID ${id} não encontrada.`);
    }
    const dayOfWeek = updateAulaDto.dayOfWeek ?? aula.dayOfWeek;
    const time = updateAulaDto.time ?? aula.time;
    if (updateAulaDto.dayOfWeek || updateAulaDto.time) {
      const existing = await this.aulasRepository.findOne({ where: { dayOfWeek, time } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Já existe uma aula agendada para ${dayOfWeek} às ${time}.`);
      }
    }
    this.aulasRepository.merge(aula, updateAulaDto);
    await this.aulasRepository.save(aula);
    return this.findOne(id);
  }

  // CANCEL
  async cancel(id: number) {
    const aula = await this.aulasRepository.findOne({ where: { id } });
    if (!aula) {
      throw new NotFoundException(`Aula com ID ${id} não encontrada.`);
    }
    await this.aulasRepository.update(id, { status: AulaStatus.CANCELADA });
    return this.findOne(id);
  }

  // DELETE
  async remove(id: number) {
    const aula = await this.aulasRepository.findOne({
      where: { id },
      relations: ['aulaIngredients'],
    });
    if (!aula) {
      throw new NotFoundException(`Aula com ID ${id} não encontrada.`);
    }
    return await this.aulasRepository.remove(aula);
  }
}