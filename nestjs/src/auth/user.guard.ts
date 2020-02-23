// see https://github.com/nestjs/docs.nestjs.com/issues/237

import {
    CanActivate, // eslint-disable-line no-unused-vars
    ExecutionContext, // eslint-disable-line no-unused-vars
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { CryptoVerifyService } from "src/cryptoVerify/cryptoVerify.service"; // eslint-disable-line no-unused-vars

import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars

const logger = new Logger("user.guard.ts");

//
// Require caller to be signed in with a non-banned user account
//
@Injectable()
class UserGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService, // eslint-disable-line no-unused-vars
        private readonly cryptoVerifyService: CryptoVerifyService, // eslint-disable-line no-unused-vars
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        try {
            if (request.session.user && request.session.user.email) {
                if (
                    this.cryptoVerifyService.cryptoVerify(
                        request.session.user,
                        request.session.userSignature,
                    ) !== true
                ) {
                    logger.warn("invalid user signature", "ca-01");
                    return false;
                }
                if (
                    this.authService.isBannedUser(
                        request.session.user.email,
                    ) === false
                ) {
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

export { UserGuard };
