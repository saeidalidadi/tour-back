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
    const { password, username } = user;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userResult = await this.userService.createUser({
      username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: passwordHash,
      userType: user.userType,
      salt,
    });

    return { id: userResult.id };
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
    console.log('user is', user);
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        firstName: user.firstName,
        roles: user.roles.split(','),
        lastName: user.lastName,
        avatar: user.avatar,
      },
    };
  }

  async getUserRoles(userID: number) {
    return (await this.userService.findOneById(userID)).roles;
  }
}
