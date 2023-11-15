import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignupDto } from './signup/signup.dto';
import { SignupService } from './signup/signup.service';
import { UserDto } from './domain/user.dto';
import { ChallengeService } from './challenge/challenge.service';
import { SigninDto } from './signin/signin.dto';
import { SigninService } from './signin/signin.service';
import { ChallengeDto } from './challenge/challenge.dto';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { SigninResponseDto } from './signin/signin-response.dto';
import { RequestWithUser } from 'src/infrastructure/jwt/request-with-user.dto';
import { ProfileService } from './profile/profile.service';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(
    private readonly signupService: SignupService,
    private readonly signinService: SigninService,
    private readonly challengeService: ChallengeService,
    private readonly profileService: ProfileService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Account is not authenticated' })
  @Post('signup')
  @ApiOperation({ summary: 'Register handle' })
  async signup(
    @Body() model: SignupDto,
    @Req() request: RequestWithUser,
  ): Promise<UserDto> {
    return await this.signupService.registerHandle(model.handle, request.user);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin user' })
  async signin(
    @Request() req,
    @Body() model: SigninDto,
  ): Promise<SigninResponseDto> {
    return await this.signinService.verify(
      model.challenge,
      model.signature,
      `${req.protocol}://${req.get('host')}`,
    );
  }

  @Get('signin/challenge')
  @ApiOperation({ summary: 'parameters needed to build the siwe message' })
  challenge(@Query('address') address: string, @Request() req): Promise<ChallengeDto> {
    return this.challengeService.createChallenge(address, `${req.protocol}://${req.get('host')}`);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('account')
  @ApiUnauthorizedResponse({ description: 'Account is not authenticated' })
  @ApiOperation({ summary: 'Get user profile' })
  profile(@Req() request: RequestWithUser): Promise<UserDto> {
    return this.profileService.getProfile(request.user)
  }
}
