import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupService } from './signup/signup.service';
import { User } from './domain/user.domain';
import { ChallengeService } from './challenge/challenge.service';
import { SigninService } from './signin/signin.service';
import { JwtStrategy } from 'src/infrastructure/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwt_secret } from 'src/infrastructure/jwt/jwt-secret';
import { UserService } from './domain/user.service';
import { ProfileService } from './profile/profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]),         JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
          secret: jwt_secret,
      }),
  }),],
    controllers: [UsersController],
    providers: [SignupService, ChallengeService, SigninService, JwtStrategy, UserService, ProfileService],
  })
export class UsersModule {}
