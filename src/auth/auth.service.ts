import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Mail } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationEntity } from '../entities/verification.entity';
import { Or, Repository } from 'typeorm';
import { User } from '../entities';
import { VerificationTypeEnum } from '../enums';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(VerificationEntity)
    private verificationRepository: Repository<VerificationEntity>,
    private jwtService: JwtService,
    private mailService: Mail,
  ) {}

  async register(user: RegisterDto) {
    const { email, mobile } = user;

    console.log('email or mobile', email, mobile);

    try {
      const result = await this.userService.createUser(user);
      // send sms or email verification code
      const randomCode = Math.floor(Math.random() * 90000) + 10000;
      const auth = this.verificationRepository.create();
      auth.verificationCode = randomCode.toString();
      auth.user = { id: result.id } as User;

      if (email) {
        await this.mailService.sendMail({
          subject: 'Signup Verification',
          to: email,
          html: `<h3 style="display:inline">Verification code: </h3><b style="color: #c78a10">${randomCode}</b>`,
        });
        auth.verificationType = VerificationTypeEnum.SIGNUP_EMAIL;
      } else {
        // send sms to registered mobile
        console.log('sms code = %s', randomCode);
        auth.verificationType = VerificationTypeEnum.SIGNUP_MOBILE;
      }
      await this.verificationRepository.save(auth);
      return result;
    } catch (err) {
      throw err;
    }
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
        roles: user.roles && user.roles.split(','),
        lastName: user.lastName,
        avatar: user.avatar,
        id: user.id,
      },
    };
  }

  async getUserRoles(userID: number) {
    return (await this.userService.findOneById(userID)).roles;
  }

  async verifyMobileOrEmail(data: any) {
    const auth = await this.verificationRepository.findOne({
      where: {
        verificationCode: data.code,
        user: [{ mobile: data.mobile }, { email: data.email }],
      },
      relations: { user: true },
    });
    if (!auth) {
      throw new NotFoundException('کد وارد شده صحیح نیست');
    }

    const expiry = differenceInSeconds(new Date(), auth.createdAt);
    console.log('expiry', expiry);
    if (auth.retryCount >= 4) {
      throw new ForbiddenException('تلاش زیاد. کد منقضی شده است');
    }
    await this.verificationRepository.update(auth.id, {
      retryCount: auth.retryCount + 1,
    });
    if (expiry >= 180) {
      throw new ForbiddenException('کد منقضی شده است');
    }
    if (
      (data.mobile && data.mobile == auth.user.mobile) ||
      (data.email && data.email == auth.user.email)
    ) {
      return this.login(auth.user);
    } else {
      throw new ForbiddenException('خطای اعتبارسنجی');
    }
  }
}
