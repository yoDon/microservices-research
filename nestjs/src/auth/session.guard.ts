// see https://github.com/nestjs/docs.nestjs.com/issues/237

import {
    CanActivate, // eslint-disable-line no-unused-vars
    ExecutionContext, // eslint-disable-line no-unused-vars
    UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

//
// Require caller to be signed in with a non-banned user account
//
class SessionGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        try {
            if (request.session.user && request.session.user.email) {
                if (this.authService.isBannedUser(request.session.user.email) === false) {
                    this.authService.sawUser(request.session.user.email);
                    return true;
                }
                return false;
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
        return false;
    }
}

export { SessionGuard };
