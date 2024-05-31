import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { Role } from '../auth/enums/roles.enum';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly imageService: ImagesService,
  ) {}
  async createUser(user: Partial<UserDto>): Promise<User> {
    console.log(user);
    const userData = this.usersRepository.create();
    userData.firstName = user.firstName;
    userData.email = user.username;
    userData.lastName = user.lastName;
    userData.password = user.password;
    userData.salt = user.salt;
    if (user.userType == 'PROVIDER') {
      userData.roles = 'leader';
    }
    return await this.usersRepository.save(userData);
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

  async updateAvatar(userId: number, path, storagePath) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException();
      }
      console.log('path', path, storagePath);
      await this.usersRepository.update(userId, { avatar: path });
      const result = await this.imageService.removeImage(user.avatar);
      // console.log('result ____', result);
    } catch (err) {}
  }

  async getAvatar(userId: number) {
    return await this.usersRepository.findOne({
      where: { id: userId },
      select: ['avatar'],
    });
  }
}
