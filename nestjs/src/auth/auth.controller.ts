import {
    Controller,
    Get,
    // Logger,
    Req,
    Session,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express"; // eslint-disable-line no-unused-vars

import { IUserApp, IUserVisible } from ".";
import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars
import { UserGuard } from "./user.guard";

// const logger = new Logger("auth.controller.ts");

@Controller("auth")
class AuthController {
    constructor(private readonly authService: AuthService) {} // eslint-disable-line no-unused-vars

    @Get("userinfo")
    @UseGuards(UserGuard)
    @ApiOperation({ summary: "Get user info for currently logged in user" })
    @ApiResponse({
        status: 200,
        description: "JSON",
    })
    userinfo(@Session() session: { user:IUserApp }, @Req() req: Request) {
        return this.authService.getUserInfo(session.user);
    }
}

export { AuthController };
