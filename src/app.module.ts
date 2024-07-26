import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entities/index';
import { ToursModule } from './tours/tours.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { LeaderModule } from './leader/leader.module';
import { AppLoggerMiddleware } from './middlewares/logger.middleware';
import { ImagesModule } from './images/images.module';
import { Mail } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const database = config.get('database');
        return {
          type: 'postgres',
          host: database.host,
          port: database.port,
          username: database.user,
          password: database.password,
          database: database.name,
          entities: [...entities],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    ToursModule,
    AuthModule,
    LeaderModule,
    ImagesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
