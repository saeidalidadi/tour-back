import { Module } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour, ImageEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, ImageEntity])],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
