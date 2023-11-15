import { Injectable } from '@nestjs/common';
import { UserService } from '../domain/user.service';
import { AuthUserDto } from 'src/infrastructure/jwt/auth-user.dto';
import { UserDto } from '../domain/user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async getProfile(authenticatedUser: AuthUserDto): Promise<UserDto> {
    const userDb = await this.userService.getUser(authenticatedUser.id);
    return new UserDto(userDb?.handle?? null, userDb.address);
  }
}
