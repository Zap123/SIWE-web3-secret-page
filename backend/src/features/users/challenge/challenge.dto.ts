export class ChallengeDto {
    constructor(address: string, statement: string, nonce: string, issuedAt: string, uri: string){
        this.address = address;
        this.statement = statement;
        this.nonce = nonce;
        this.issuedAt = issuedAt;
        this.uri = uri
    }
    address: string;
    statement: string;
    nonce: string;
    issuedAt: string;
    uri: string;
}