import { BadRequestException, Injectable } from "@nestjs/common";
import { ChallengeService } from "../challenge/challenge.service";
import { SigninChallenge } from "./signin.dto";
import { SigninResponseDto } from "./signin-response.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../domain/user.service";
import { AuthUserDto } from "src/infrastructure/jwt/auth-user.dto";

@Injectable()
export class SigninService{
    constructor(private readonly challengeService: ChallengeService, private readonly jwtService: JwtService, private readonly userService: UserService){}

    async verify(challenge: SigninChallenge, signature: string, uri: string): Promise<SigninResponseDto>{
        try {
            const response = await this.challengeService.verifyChallenge(challenge, signature, uri)
            // Create or retrieve user
            const userDb = await this.userService.getOrCreateUser(response.data.address)
            const userDto = new AuthUserDto(userDb)
            const jwt = this.jwtService.sign(JSON.stringify(userDto));
            return new SigninResponseDto(jwt)
            
        } catch (error){
            console.debug(error)
            throw new BadRequestException(`Invalid challenge ${JSON.stringify(error)}`)
        }
    }

}