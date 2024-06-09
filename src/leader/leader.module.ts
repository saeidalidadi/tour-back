import { Module } from '@nestjs/common';
import { LeaderController } from './leader.controller';
import { AuthModule } from '../auth/auth.module';
import { ToursModule } from '../tours/tours.module';
import { LeaderService } from './leader.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leader, LeadersRate } from '../entities';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    AuthModule,
    ToursModule,
    UserModule,
    TypeOrmModule.forFeature([Leader, LeadersRate]),
    ImagesModule,
  ],
  controllers: [LeaderController],
  providers: [LeaderService],
})
export class LeaderModule {}
