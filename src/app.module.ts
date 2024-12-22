import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './database/typeorm.config';
import { ImportController } from './import/import.controller';
import { ImportService } from './import/import.service';
import { RewardController } from './reward/reward.controller';
import { RewardService } from './reward/reward.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  controllers: [AppController, ImportController, RewardController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    AppService,
    ImportService,
    RewardService,
  ],
})
export class AppModule {}
