import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import {
    CookieSessionModule,
    NestCookieSessionOptions, // eslint-disable-line no-unused-vars
} from "nestjs-cookie-session";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CookieSerializer } from "./cookie.serializer";

@Module({
    imports: [
        PassportModule.register({ session: true }),
        CookieSessionModule.forRoot({
            session: {
                secret: process.env.APP_COOKIESECRET || "TODO CHANGEME",
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
            },
        }),
    ],
    providers: [AuthService, CookieSerializer],
    controllers: [AuthController],
    exports: [PassportModule],
})

export class AuthModule {}
