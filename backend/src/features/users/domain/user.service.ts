import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.domain';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Crud interface for users
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getOrCreateUser(address: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { address } });
    if (user) {
      return user;
    } else {
      const newUser = this.usersRepository.create({ address });
      return this.usersRepository.save(newUser);
    }
  }

  async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }
}
