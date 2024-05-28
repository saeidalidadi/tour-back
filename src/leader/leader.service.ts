import { Injectable } from '@nestjs/common';
import { ToursService } from '../tours/tours.service';
import { UserService } from '../user/user.service';
import { Role } from '../auth/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Leader } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class LeaderService {
  constructor(
    @InjectRepository(Leader)
    private readonly leaderRepository: Repository<Leader>,
    private readonly tourService: ToursService,
    private readonly userService: UserService,
  ) {}
  async getLeaderTours(leaderId: number, page: number) {
    return await this.tourService.getLeaderTours(leaderId, page);
  }

  async list() {
    return await this.userService.findByRole(Role.Leader);
  }

  async getMyProfile(userId: number) {
    const row = await this.leaderRepository.findOne({
      where: { user: { id: userId } as Leader },
      relations: { user: true },
      select: { user: { firstName: true, lastName: true } },
    });

    return row;
  }
}
