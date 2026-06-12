import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';
import { Aula } from './entities/aula.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Ingredient, User])],
  controllers: [AulasController],
  providers: [AulasService],
})
export class AulasModule {}
