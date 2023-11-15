import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from '../domain/user.dto';
import { HandleTaken } from './errors/handle-taken';
import { User } from '../domain/user.domain';
import { AuthUserDto } from 'src/infrastructure/jwt/auth-user.dto';

@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async registerHandle(
    handle: string,
    authenticatedUser: AuthUserDto,
  ): Promise<UserDto> {
    // Check handle is not taken
    let handleInUse = await this.usersRepository.findOne({
      where: [{ handle: handle }],
    });

    if (handleInUse && handleInUse.handle === handle) {
      throw new HandleTaken(handle);
    } else {
      let storedUser = await this.usersRepository.findOne({
        where: [{ id: authenticatedUser.id }],
      });
      if (storedUser.handle != null)
        throw new ConflictException('User already signed up');
      storedUser.handle = handle;
      await this.usersRepository.save(storedUser);
      return new UserDto(storedUser.handle, storedUser.address);
    }
  }
}
