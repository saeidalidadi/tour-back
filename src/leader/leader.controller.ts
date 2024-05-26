import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { LeaderService } from './leader.service';

@Controller('leaders')
export class LeaderController {
  constructor(private readonly leaderService: LeaderService) {}

  @Get(':id/tours')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getMyTours(@Param('id') leaderId: number, @Query('page') page: number) {
    return this.leaderService.getLeaderTours(leaderId, page);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  list() {
    console.log('leaders api>>>');
    return this.leaderService.list();
  }
}
