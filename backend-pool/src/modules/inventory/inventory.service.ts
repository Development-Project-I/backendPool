import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  // CREATE
  async create(createInventoryDto: CreateInventoryDto) {
    const newItem = this.inventoryRepository.create(createInventoryDto);
    return await this.inventoryRepository.save(newItem);
  }

  // READ all
  async findAllWithAlerts() {
    const items = await this.inventoryRepository.find();
    const currentDate = new Date();

    return items.map((item) => {
      let status = 'OK';

      if (item.quantity <= 0) {
        status = 'Esgotado';
      } else if (new Date(item.expiryDate) < currentDate) {
        status = 'Vencido';
      } else if (item.quantity <= 10) {
        status = 'Estoque Baixo'; 
      }

      return {
        ...item,
        status,
      };
    });
  }

  // READ por id
  async findOne(id: number) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Insumo com ID ${id} não encontrado no estoque.`);
    }
    return item;
  }

  // UPDATE
  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const item = await this.findOne(id);
    this.inventoryRepository.merge(item, updateInventoryDto);
    return await this.inventoryRepository.save(item);
  }

  // DELETE
  async remove(id: number) {
    const item = await this.findOne(id);
    return await this.inventoryRepository.remove(item);
  }
}