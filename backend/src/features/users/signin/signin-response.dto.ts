export class SigninResponseDto{
    constructor(jwt:string){
        this.jwt = jwt
    }
    jwt:string
}