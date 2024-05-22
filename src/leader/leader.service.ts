import { Injectable } from '@nestjs/common';
import { ToursService } from '../tours/tours.service';

@Injectable()
export class LeaderService {
  constructor(private readonly tourService: ToursService) {}
  async getLeaderTours(leaderId: number) {}
}
