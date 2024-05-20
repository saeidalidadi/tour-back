import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(user: Partial<UserDto>): Promise<User> {
    console.log(user);
    const userData = this.usersRepository.create();
    userData.firstName = user.firstName;
    userData.email = user.username;
    userData.lastName = user.lastName;
    userData.password = user.password;
    userData.salt = user.salt;
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
}
