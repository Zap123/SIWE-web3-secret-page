export class SigninDto{
    challenge: SigninChallenge
    signature: string
}

export class SigninChallenge{
    address: string;
    nonce: string;
    issuedAt: string;
}