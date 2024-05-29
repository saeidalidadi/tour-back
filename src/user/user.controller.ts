import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/avatar')
  @UseGuards(JwtAuthGuard)
  getMyAvatar(@Request() req: any) {
    console.log('avatar request');
    return this.userService.getAvatar(req.user.id);
  }
}
