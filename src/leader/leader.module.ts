import { Module } from '@nestjs/common';
import { LeaderController } from './leader.controller';
import { AuthModule } from '../auth/auth.module';
import { ToursModule } from '../tours/tours.module';
import { LeaderService } from './leader.service';

@Module({
  imports: [AuthModule, ToursModule],
  controllers: [LeaderController],
  providers: [LeaderService],
})
export class LeaderModule {}
