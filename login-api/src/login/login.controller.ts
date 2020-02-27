import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import {
    IUserInfo, // eslint-disable-line no-unused-vars
} from "../auth";
import { LoginService } from "./login.service"; // eslint-disable-line no-unused-vars

const logger = new Logger("login.controller.ts");

@Controller("login")
class LoginController {
    constructor(private readonly loginService: LoginService) {} // eslint-disable-line no-unused-vars

    @Get("userInfo")
    @ApiOperation({ summary: "Get user info after login" })
    async userInfo(@Query("accessCode") accessCode: string): Promise<IUserInfo> {
        try {
            const result: IUserInfo = await this.loginService.getUserInfo(accessCode);
            return result;
        } catch (reason) {
            logger.warn(reason, "LoginController-userInfo-01");
            return this.loginService.noUser();
        }
    }
}

export { LoginController };
