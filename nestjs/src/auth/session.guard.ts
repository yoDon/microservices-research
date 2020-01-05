// see https://github.com/nestjs/docs.nestjs.com/issues/237

import {
    CanActivate, // eslint-disable-line no-unused-vars
    ExecutionContext, // eslint-disable-line no-unused-vars
    UnauthorizedException,
} from "@nestjs/common";

class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        try {
            if (request.session.passport.user) {
                return true;
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}

export { SessionGuard };
