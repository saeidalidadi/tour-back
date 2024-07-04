import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { Role } from '../auth/enums/roles.enum';
import { ImagesService } from '../images/images.service';
import { USER_TYPE } from '../enums';
import { LeaderService } from '../leader/leader.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly imageService: ImagesService,
    private readonly leaderService: LeaderService,
  ) {}

  async createUser(user: Partial<UserDto>): Promise<User> {
    const userData = this.usersRepository.create();
    userData.firstName = user.firstName;
    userData.lastName = user.lastName;
    userData.mobile = user.mobile;
    userData.email = user.email;
    userData.gender = user.gender;
    console.log('user is___', user);
    if (user.userType == USER_TYPE.TOUR_PROVIDER) {
      userData.roles = 'leader';
      userData.isActive = false;
    } else {
      userData.roles = 'user';
    }
    try {
      const userRow = await this.usersRepository.save(userData);
      console.log('user row is', userRow);
      if (user.userType == USER_TYPE.TOUR_PROVIDER) {
        await this.leaderService.create(userRow.id, user.mobile);
      }
      return userRow;
    } catch (err) {
      if (err.code == 23505) {
        throw new ConflictException(
          'شما قبلا با این ایمیل یا شماره موبایل ثبت نام کرده اید',
        );
      }
    }
  }

  async findOneById(userId: number) {
    return await this.usersRepository.findOneOrFail({ where: { id: userId } });
  }

  async findOneByEmail(email: string): Promise<Required<User> | null> {
    return (await this.usersRepository.findOneBy({
      email: email,
    })) as Required<User>;
  }

  async getProfile(id: number) {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findByRole(role: Role) {
    const [list, count] = await this.usersRepository.findAndCount({
      where: { roles: role },
    });
    return { list, total: count };
  }

  async updateAvatar(userId: number, files) {
    if (files.avatar) {
      const avatar = await this.imageService.uploadImage(
        files.avatar[0],
        'avatars',
        100,
      );

      try {
        const user = await this.usersRepository.findOne({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException();
        }
        console.log('path', avatar);
        await this.usersRepository.update(userId, { avatar: avatar.path });
        const result = await this.imageService.removeImage(user.avatar);
        // console.log('result ____', result);
      } catch (err) {}
    }
  }

  async getAvatar(userId: number) {
    return await this.usersRepository.findOne({
      where: { id: userId },
      select: ['avatar'],
    });
  }

  async getMyProfile(userId: number) {
    const row = await this.usersRepository.findOne({
      where: { id: userId },
      select: { firstName: true, lastName: true, avatar: true, mobile: true },
    });

    return { user: row };
  }

  async updateProfile(userId, dto, files) {
    return await this.updateAvatar(userId, files);
  }

  async findByEmailOrMobile(email: string, mobile: string) {
    return (await this.usersRepository.findOne({
      where: [{ email: email }, { mobile: mobile }],
    })) as Required<User>;
  }

  async setVerified(userId: number, verificationTarget: 'mobile' | 'email') {
    console.log('update mobile or email verification target____', userId);
    return await this.usersRepository.update(userId, { mobileVerified: true });
  }

  async getActiveStatus(userId: number) {
    return (await this.usersRepository.findOne({ where: { id: userId } }))
      .isActive;
  }
}
