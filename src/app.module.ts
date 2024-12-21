import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './database/typeorm.config';
import { ImportController } from './import/import.controller';
import { ImportService } from './import/import.service';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  controllers: [AppController, ImportController],
  providers: [AppService, ImportService],
})
export class AppModule {}
