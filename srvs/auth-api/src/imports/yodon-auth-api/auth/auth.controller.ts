import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import {
    IUserInfo, // eslint-disable-line no-unused-vars
} from "../../yodon-auth-types";
import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars

const logger = new Logger("auth.controller.ts");

@Controller("auth")
class AuthController {
    constructor(private readonly authService: AuthService) {} // eslint-disable-line no-unused-vars

    @Get("userInfo")
    @ApiOperation({ summary: "Get user info after login" })
    async userInfo(
        @Query("accessCode") accessCode: string,
    ): Promise<IUserInfo> {
        try {
            const result: IUserInfo = await this.authService.getUserInfo(
                accessCode,
            );
            return result;
        } catch (reason) {
            logger.warn(reason, "AuthController-userInfo-01");
            return this.authService.noUser();
        }
    }
}

export { AuthController };
