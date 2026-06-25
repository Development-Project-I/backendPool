import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    const expiryDate = new Date(createInventoryDto.expiryDate);
    if (isNaN(expiryDate.getTime())) {
      throw new BadRequestException('expiryDate inválida');
    }

    const itemDuplicado = await this.inventoryRepository.findOne({ //aqui ta busancado por nome e validade, caso exista um item com o mesmo nome e validade, vai lançar uma exceção de conflito
      where: {
        name: createInventoryDto.name,
        expiryDate: expiryDate,
      },
    });

    if (itemDuplicado) {
      throw new ConflictException(
        `O item '${createInventoryDto.name}' com validade para '${createInventoryDto.expiryDate}' já está registrado no estoque.`
      );
    }

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