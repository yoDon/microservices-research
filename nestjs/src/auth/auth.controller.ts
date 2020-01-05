import {
    Controller,
    Get,
    Logger,
    Query,
    Req,
    Res,
    Session,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express"; // eslint-disable-line no-unused-vars

import { authErrorUrl } from "../../constants";
import { AuthService } from "./auth.service"; // eslint-disable-line no-unused-vars
import { SessionGuard } from "./session.guard";

const logger = new Logger("auth.controller.ts");

@Controller("auth")
class AuthController {
    constructor(private readonly authService: AuthService) {} // eslint-disable-line no-unused-vars

    @Get("userinfo")
    // @UseGuards(SessionGuard)
    // TODO should add custom @SessionUser decorator that extends session and return the user
    userinfo(@Session() session: { user?: string }) {
        if (session) {
            return session.user;
        } else {
            return;
        }
    }

    @Get("prelogin")
    @ApiOperation({ title: "Initiate login sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to Auth0 login page with unique nonce",
    })
    prelogin(@Session() session: { user?: any }, @Res() res: Response) {
        try {
            const loginUrl = this.authService.prelogin();
            res.redirect(loginUrl);
        } catch (reason) {
            logger.warn(reason, "AuthController-prelogin-01");
            res.redirect(authErrorUrl);
        }
    }

    @Get("postlogin")
    @ApiOperation({ title: "Conclude login sequence" })
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
            } = await this.authService.postlogin(code, state);
            session.user = userApp; // eslint-disable-line require-atomic-updates
            res.cookie("user", JSON.stringify(userVisible));
            res.redirect(redirect);
        } catch (reason) {
            logger.warn(reason, "AuthController-postlogin-01");
            res.redirect(authErrorUrl);
        }
    }

    @Get("prelogout")
    @ApiOperation({ title: "Initiate logout sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to Auth0 logout page",
    })
    prelogout(@Session() session: { user?: any }, @Res() res: Response) {
        try {
            if (session && session.user) {
                delete session.user;
            }
            const logoutUrl = this.authService.prelogout();
            res.redirect(logoutUrl);
        } catch (reason) {
            logger.warn(reason, "AuthController-prelogout-01");
            if (session && session.user) {
                delete session.user;
            }
            res.redirect(authErrorUrl);
        }
    }

    @Get("postlogout")
    @ApiOperation({ title: "Conclude logout sequence" })
    @ApiResponse({
        status: 304,
        description: "Redirects to SPA path set in state with cookie cleared",
    })
    postlogout(@Session() session: { user?: any }, @Res() res: Response) {
        try {
            const redirect = this.authService.postlogout();
            if (session && session.user) {
                delete session.user;
            }
            res.clearCookie("user");
            res.redirect(redirect);
        } catch (reason) {
            logger.warn(reason, "AuthController-postlogout-01");
            if (session && session.user) {
                delete session.user;
            }
            res.redirect(authErrorUrl);
        }
    }
}

export { AuthController };
