import { Injectable } from '@nestjs/common';
import { ToursService } from '../tours/tours.service';
import { UserService } from '../user/user.service';
import { Role } from '../auth/enums/roles.enum';

@Injectable()
export class LeaderService {
  constructor(
    private readonly tourService: ToursService,
    private readonly userService: UserService,
  ) {}
  async getLeaderTours(leaderId: number) {
    return await this.tourService.getLeaderTours(leaderId);
  }

  async list() {
    return await this.userService.findByRole(Role.Leader);
  }
}
