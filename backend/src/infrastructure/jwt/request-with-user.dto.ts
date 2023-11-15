import { AuthUserDto } from "./auth-user.dto";

export type RequestWithUser = Request & { user: AuthUserDto };
