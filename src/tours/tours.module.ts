import { Module, forwardRef } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour, ImageEntity, TourReservationEntity } from '../entities';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour, ImageEntity, TourReservationEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    ImagesModule,
  ],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
