// see https://github.com/nestjs/docs.nestjs.com/issues/237

import {
    CanActivate, // eslint-disable-line no-unused-vars
    ExecutionContext, // eslint-disable-line no-unused-vars
    Logger,
    UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars

const logger = new Logger("admin.guard.ts");

//
// Require caller to be signed in with a non-banned user account
//
class AdminGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService, // eslint-disable-line no-unused-vars
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        try {
            if (request.session.user && request.session.user.email) {
                if (
                    this.authService.isBannedUser(
                        request.session.user.email,
                    ) === false
                ) {
                    this.authService.sawUser(request.session.user.email);
                    if (request.session.user.roles) {
                        if (request.session.user.roles.admin) {
                            return true;
                        }
                        logger.warn(
                            "notAdmin: " + request.session.user.email,
                            "canActivate01",
                        );
                    }
                }
                return false;
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
        return false;
    }
}

export { AdminGuard };
