import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(user: RegisterDto) {
    const { email, mobile } = user;

    console.log('email or mobile', email, mobile);

    return await this.userService.createUser(user);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(username);
    if (user) {
      const { password, ...result } = user;
      const isValid = await bcrypt.compare(pass, password);
      if (isValid) {
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        firstName: user.firstName,
        roles: user.roles.split(','),
        lastName: user.lastName,
        avatar: user.avatar,
        id: user.id,
      },
    };
  }

  async getUserRoles(userID: number) {
    return (await this.userService.findOneById(userID)).roles;
  }
}
