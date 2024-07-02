import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ImagesModule } from '../images/images.module';
import { UserController } from './user.controller';
import { LeaderModule } from '../leader/leader.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ImagesModule,
    forwardRef(() => LeaderModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
