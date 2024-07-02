import { AuthService } from './auth.service';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async register(@Body() user: RegisterDto) {
    // return 'success registeration';
    return await this.authService.register(user);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @Post('/verify')
  verifyMobileOrEmail(@Body() body: any) {
    return this.authService.verifyMobileOrEmail(body);
  }

  @Post('/send-otp')
  sendOtp(@Body() body: any) {
    return this.authService.sendOtpAuth(body);
  }
}
