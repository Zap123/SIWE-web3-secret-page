import { User } from "src/features/users/domain/user.domain";

export class AuthUserDto{
    constructor(user: User){
        this.id = user.id;
        this.handle = user.handle;
        this.address = user.address;
    
    }
    id: number;
    handle: string;
    address: string;
}