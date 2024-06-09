import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ToursService } from '../tours/tours.service';
import { UserService } from '../user/user.service';
import { Role } from '../auth/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Leader, LeadersRate, User } from '../entities';
import { Repository } from 'typeorm';
import { UpdateLeaderDto } from './dto/update-leader.dto';
import { ImagesService } from '../images/images.service';
import { CreateLeadersRateDto } from './dto/create-leaders-rate.dto';

@Injectable()
export class LeaderService {
  constructor(
    @InjectRepository(Leader)
    private readonly leaderRepository: Repository<Leader>,
    @InjectRepository(LeadersRate)
    private readonly leaderRateRepository: Repository<LeadersRate>,
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

  async getLeadersProfile(leaderId: number) {
    const leader = await this.leaderRepository.findOne({
      where: { id: leaderId },
      relations: { user: true },
      select: {
        intro: true,
        id: true,
        user: { firstName: true, lastName: true },
      },
    });
    console.log('user and leader data', leader);
    return leader;
  }

  async rate(leaderId: number, userId: number, data: CreateLeadersRateDto) {
    const leader = await this.leaderRepository.findOne({
      where: { id: leaderId },
    });
    if (!leader) {
      throw new NotFoundException();
    }

    const rateRow = await this.leaderRateRepository.exists({
      where: { leader: leader, user: { id: userId } as User },
    });
    if (rateRow) {
      throw new NotAcceptableException('شما قبلا به این لیدر امتیاز داده اید');
    }

    const rate = this.leaderRateRepository.create();
    rate.leader = leader;
    rate.user = { id: userId } as User;
    rate.rate = data.rate;

    const result = await this.leaderRateRepository.save(rate);
    return { data: result, success: true };
  }
}
