import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Request,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { LeaderService } from './leader.service';
import { UpdateLeaderDto } from './dto/update-leader.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nest-lab/fastify-multer';

@Controller('leaders')
export class LeaderController {
  constructor(private readonly leaderService: LeaderService) {}

  @Get(':id/tours')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getLeaderTours(@Param('id') leaderId: number, @Query('page') page: number) {
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

  @Get('/profile')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req: any) {
    return this.leaderService.getMyProfile(req.user.id);
  }

  @Put('/profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  updateMyProfile(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File },
    @Body() leaderDto: UpdateLeaderDto,
    @Request() req: any,
  ) {
    console.log('files___', files);
    return this.leaderService.updateProfile(req.user.id, leaderDto, files);
  }

  @Get('/tours')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getMyTours(@Request() req: any, @Query() query: number) {
    console.log('tours api log....');
    return this.leaderService.getLeaderTours(req.user.id, query);
  }

  @Get(':id/profile')
  getLeaderProfile(@Param('id') id: number) {
    return this.leaderService.getLeadersProfile(id);
  }
}
