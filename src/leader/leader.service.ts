import { Injectable } from '@nestjs/common';
import { ToursService } from '../tours/tours.service';
import { UserService } from '../user/user.service';
import { Role } from '../auth/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Leader, User } from '../entities';
import { Repository } from 'typeorm';
import { UpdateLeaderDto } from './dto/update-leader.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class LeaderService {
  constructor(
    @InjectRepository(Leader)
    private readonly leaderRepository: Repository<Leader>,
    private readonly tourService: ToursService,
    private readonly userService: UserService,
    private readonly imageService: ImagesService,
  ) {}
  async getLeaderTours(leaderId: number, queries: any) {
    return await this.tourService.getLeaderTours(leaderId, queries);
  }

  async list() {
    return await this.userService.findByRole(Role.Leader);
  }

  async getMyProfile(userId: number) {
    const row = await this.leaderRepository.findOne({
      where: { user: { id: userId } as User },
      relations: { user: true },
      select: { user: { firstName: true, lastName: true, avatar: true } },
    });

    return row;
  }

  async updateProfile(
    userId: number,
    data: UpdateLeaderDto,
    files: { avatar?: Express.Multer.File },
  ) {
    console.log('profile dto daa____', data);
    await this.userService.updateAvatar(userId, files);
    const updateLeaderResult = await this.leaderRepository.update(
      {
        user: { id: userId } as User,
      },
      { intro: data.leader.intro },
    );
    return updateLeaderResult;
  }
}
