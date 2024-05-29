import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.useStaticAssets({
    root: join(__dirname, '../public'),
    serve: true,
    wildcard: true,
    prefix: '/public',
  });
  app.register(multipart);
  await app.listen(3001);
}
// Learn more at https://deno.land/manual/examples/module_metadata#concepts

bootstrap();
