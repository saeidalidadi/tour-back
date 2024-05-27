import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  console.log('process ', process.env.NODE_ENV);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.register(multipart);
  await app.listen(3001);
}
// Learn more at https://deno.land/manual/examples/module_metadata#concepts

bootstrap();
