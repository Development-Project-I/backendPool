import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';
import { Aula } from './entities/aula.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Ingredient])],
  controllers: [AulasController],
  providers: [AulasService],
})
export class AulasModule {}
