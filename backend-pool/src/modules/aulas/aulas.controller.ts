import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { CreateIngredientDto } from '../ingredients/dto/create-ingredient.dto';

@ApiTags('Aulas')
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulasService.create(createAulaDto);
  }

  @Post(':id/ingredientes')
  addIngredient(
    @Param('id') id: string,
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    return this.aulasService.addIngredient(+id, createIngredientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as aulas registradas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna um array contendo todas as aulas com o schema ApiAula e itens de inventário.',
    type: [ApiAulaResponseDto] 
  })
  findAll() {
    return this.aulasService.findAll();
  }

  
  @Get(':id')
  @ApiOperation({ summary: 'Buscar os detalhes de uma aula específica por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Aula encontrada e contratos carregados com sucesso.',
    type: ApiAulaResponseDto
  })
  @ApiResponse({ status: 404, description: 'Aula não encontrada no banco de dados.' })
  findOne(@Param('id') id: string) {
    return this.aulasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulasService.update(+id, updateAulaDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.aulasService.cancel(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.aulasService.remove(+id);
  }
}