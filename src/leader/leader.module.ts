import { Module, forwardRef } from '@nestjs/common';
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
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    ToursModule,
    TypeOrmModule.forFeature([Leader, LeadersRate]),
    ImagesModule,
  ],
  controllers: [LeaderController],
  providers: [LeaderService],
  exports: [LeaderService],
})
export class LeaderModule {}
