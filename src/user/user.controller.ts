import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/avatar')
  @UseGuards(JwtAuthGuard)
  getMyAvatar(@Request() req: any) {
    console.log('avatar request');
    return this.userService.getAvatar(req.user.id);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req: any) {
    return this.userService.getMyProfile(req.user.id);
  }

  @Put('/profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @UseGuards(JwtAuthGuard)
  updateMyProfile(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File },
    @Body() leaderDto: any,
    @Request() req: any,
  ) {
    return this.userService.updateProfile(req.user.id, leaderDto, files);
  }
}
