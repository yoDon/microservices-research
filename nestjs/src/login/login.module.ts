import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CookieSessionModule } from "nestjs-cookie-session";

import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { CookieSerializer } from "../auth/cookie.serializer";
import { cookieSecret } from "../constants";

@Module({
    imports: [
        PassportModule.register({ session: true }),
        CookieSessionModule.forRoot({
            session: {
                secret: cookieSecret,
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
            },
        }),
    ],
    providers: [LoginService, CookieSerializer],
    controllers: [LoginController],
})

export class LoginModule {}
