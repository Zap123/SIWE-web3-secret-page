import { ConflictException } from "@nestjs/common";

export class HandleTaken extends ConflictException
{
    constructor(handle: string)
    {
        super(`Handle "${handle}" is already taken`);
    }

}