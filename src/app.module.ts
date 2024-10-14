import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConf } from './database/database';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) =>
      dbConf(configService),
    inject: [ConfigService],
  }),UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
