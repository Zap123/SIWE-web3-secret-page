import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class SignupDto {
    @ApiProperty()
    @IsNotEmpty()
    handle: string
}