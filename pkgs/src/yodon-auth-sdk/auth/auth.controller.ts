import {
    Controller,
    Get,
    // Logger,
    Session,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { IUserInfo } from "../../yodon-auth-types"; // eslint-disable-line no-unused-vars
import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars
import { UserGuard } from "./user.guard";

// const logger = new Logger("auth.controller.ts");

@Controller("auth")
class AuthController {
    constructor(private readonly authService: AuthService) {} // eslint-disable-line no-unused-vars

    @Get("userinfo")
    @UseGuards(UserGuard)
    @ApiOperation({ summary: "Get currently logged in user" })
    @ApiResponse({
        status: 200,
        description: "JSON",
    })
    user(@Session() session: { userInfo: IUserInfo }) {
        return this.authService.getUser(session.userInfo);
    }
}

export { AuthController };
