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

import { IUserInfo } from "../../yodon-auth-types"; // eslint-disable-line no-unused-vars
import { loginErrorUrl } from "./envConstants";
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
        @Session() session: { userInfo?: IUserInfo },
        @Query("code") code: string,
        @Query("state") state: string,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const {
                userApp,
                userAppSignature,
                userVisible,
                userVisibleSignature,
                redirect,
            } = await this.loginService.postlogin(code, state);
            const userInfo: IUserInfo = {
                userApp,
                userAppSignature,
                userVisible,
                userVisibleSignature,
            };
            //
            // place the app-visible data into a session cookie sent
            // to the client encrypted and which is only readable
            // server-side, and place the user-visible data into a
            // separate user cookie that can be read client-side
            //
            session.userInfo = userInfo; // eslint-disable-line require-atomic-updates
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
    prelogout(
        @Session() session: { userInfo?: IUserInfo },
        @Res() res: Response,
    ) {
        if (session && session.userInfo) {
            delete session.userInfo;
        }
        res.clearCookie("user");
        res.clearCookie("usersignature");
        try {
            const logoutUrl = this.loginService.prelogout();
            res.redirect(logoutUrl);
        } catch (reason) {
            logger.warn(reason, "LoginController-prelogout-01");
            res.redirect(loginErrorUrl);
        }
    }

    @Get("postlogout")
    @ApiOperation({ summary: "Conclude logout sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to SPA path set in state with cookie cleared",
    })
    postlogout(
        @Session() session: { userInfo?: IUserInfo },
        @Res() res: Response,
    ) {
        if (session && session.userInfo) {
            delete session.userInfo;
        }
        res.clearCookie("user");
        res.clearCookie("usersignature");
        try {
            const redirect = this.loginService.postlogout();
            res.redirect(redirect);
        } catch (reason) {
            logger.warn(reason, "LoginController-postlogout-01");
            res.redirect(loginErrorUrl);
        }
    }
}

export { LoginController };
