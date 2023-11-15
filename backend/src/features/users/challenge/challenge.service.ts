import { Injectable } from "@nestjs/common";
import * as siwe from 'siwe';
import { ChallengeDto } from "./challenge.dto";
import { SigninChallenge } from "../signin/signin.dto";

@Injectable()
export class ChallengeService {
    private readonly statement = "Welcome to SIWE-web3-secret-page"
    private readonly chainId = 1 // this should be set based on environment
    uri: string

    async createChallenge(address:string, uri:string){
        const nonce = siwe.generateNonce()
        const issuedAt = new Date().toISOString()
        return new ChallengeDto(address, this.statement, nonce, issuedAt, uri)    
    }

    async verifyChallenge(signin: SigninChallenge, signature: string, uri: string): Promise<siwe.SiweResponse>{
        const siweMessage = new siwe.SiweMessage({statement: this.statement,
             domain: new URL(uri).hostname,
             uri: uri, 
             address: signin.address, 
             chainId: this.chainId, 
             nonce: signin.nonce, 
             version: '1',
             issuedAt: signin.issuedAt});

        // here nonce, uri and domain can be validated server side
        //console.debug(`== COPY TO SIGN WITHOUT FE == \n${siweMessage.prepareMessage()}\n====`)

        return await siweMessage.verify({signature})

    }

}