import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'gastro_user',
      password: 'gastro_password',
      database: 'gastroplan_db',
      autoLoadEntities: true, 
      synchronize: true, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}