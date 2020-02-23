import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CookieSessionModule } from "nestjs-cookie-session";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CookieSerializer } from "./cookie.serializer";
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
    providers: [AuthService, CookieSerializer],
    controllers: [AuthController],
})

export class AuthModule {}
