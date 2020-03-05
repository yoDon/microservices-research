// see https://github.com/nestjs/docs.nestjs.com/issues/237

import {
  CanActivate, // eslint-disable-line no-unused-vars
  ExecutionContext, // eslint-disable-line no-unused-vars
  Injectable,
  Logger,
  UnauthorizedException
} from "@nestjs/common";

import { CryptoVerifyService } from "../cryptoVerify/cryptoVerify.service"; // eslint-disable-line no-unused-vars
import { IUserInfo } from "."; // eslint-disable-line no-unused-vars
import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars

const logger = new Logger("user.guard.ts");

//
// Require caller to be signed in with a non-banned user account
//
@Injectable()
class UserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService, // eslint-disable-line no-unused-vars
    private readonly cryptoVerifyService: CryptoVerifyService // eslint-disable-line no-unused-vars
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    try {
      const userInfo: IUserInfo | undefined = request.session.userInfo;
      if (userInfo && userInfo.userApp && userInfo.userApp.email) {
        if (
          this.cryptoVerifyService.cryptoVerify(
            userInfo.userApp,
            userInfo.userAppSignature
          ) !== true
        ) {
          logger.warn("invalid userApp signature", "ca-01");
          return false;
        }
        if (
          this.cryptoVerifyService.cryptoVerify(
            userInfo.userVisible,
            userInfo.userVisibleSignature
          ) !== true
        ) {
          logger.warn("invalid userVisible signature", "ca-02");
          return false;
        }
        if (this.authService.isBannedUser(userInfo.userApp.email) === false) {
          this.authService.sawUser(userInfo.userApp.email);
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
