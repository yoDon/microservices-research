import {
    Controller,
    Get,
    Logger,
    Query,
    Req,
    Res,
    Session,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express"; // eslint-disable-line no-unused-vars

import { loginErrorUrl } from "../env";
import { LoginService } from "./login.service"; // eslint-disable-line no-unused-vars

const logger = new Logger("login.controller.ts");

@Controller("login")
class LoginController {
    constructor(private readonly loginService: LoginService) {} // eslint-disable-line no-unused-vars

    @Get("prelogin")
    @ApiOperation({ summary: "Initiate login sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to external login page with unique nonce",
    })
    prelogin(@Session() session: { user?: any }, @Res() res: Response) {
        try {
            const loginUrl = this.loginService.prelogin();
            res.redirect(loginUrl);
        } catch (reason) {
            logger.warn(reason, "LoginController-prelogin-01");
            res.redirect(loginErrorUrl);
        }
    }

    @Get("postlogin")
    @ApiOperation({ summary: "Conclude login sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to SPA path set in state with cookie set",
    })
    async postlogin(
        @Session() session: { user?: any },
        @Query("code") code: string,
        @Query("state") state: string,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const {
                userApp,
                userVisible,
                redirect,
            } = await this.loginService.postlogin(code, state);
            //
            // place the app-visible data into a session cookie sent
            // to the client encrypted and which is only readable
            // server-side, and place the user-visible data into a
            // separate user cookie that can be read client-side
            //
            session.user = userApp; // eslint-disable-line require-atomic-updates
            res.cookie("user", JSON.stringify(userVisible));
            res.redirect(redirect);
        } catch (reason) {
            logger.warn(reason, "LoginController-postlogin-01");
            res.redirect(loginErrorUrl);
        }
    }

    @Get("prelogout")
    @ApiOperation({ summary: "Initiate logout sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to external logout page",
    })
    prelogout(@Session() session: { user?: any }, @Res() res: Response) {
        try {
            if (session && session.user) {
                delete session.user;
            }
            const logoutUrl = this.loginService.prelogout();
            res.redirect(logoutUrl);
        } catch (reason) {
            logger.warn(reason, "LoginController-prelogout-01");
            if (session && session.user) {
                delete session.user;
            }
            res.redirect(loginErrorUrl);
        }
    }

    @Get("postlogout")
    @ApiOperation({ summary: "Conclude logout sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to SPA path set in state with cookie cleared",
    })
    postlogout(@Session() session: { user?: any }, @Res() res: Response) {
        try {
            const redirect = this.loginService.postlogout();
            if (session && session.user) {
                delete session.user;
            }
            res.clearCookie("user");
            res.redirect(redirect);
        } catch (reason) {
            logger.warn(reason, "LoginController-postlogout-01");
            if (session && session.user) {
                delete session.user;
            }
            res.redirect(loginErrorUrl);
        }
    }
}

export { LoginController };
