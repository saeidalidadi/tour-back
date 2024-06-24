import { DynamicModule, Module } from '@nestjs/common';
import { Mail } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [Mail],
  exports: [Mail],
})
export class MailModule {}
