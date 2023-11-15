import { ConflictException } from "@nestjs/common";

export class AddressTaken extends ConflictException
{
    constructor(address: string)
    {
        super(`Ethereum address "${address}" is already taken`);
    }

}