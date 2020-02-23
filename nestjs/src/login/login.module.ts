import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CookieSessionModule } from "nestjs-cookie-session";

import { CookieSerializer } from "../auth/cookie.serializer";
import { CryptoSignModule } from "../cryptoSign/cryptoSign.module";
import { cookieSecret } from "../envConstants";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";

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
        CryptoSignModule,
    ],
    providers: [LoginService, CookieSerializer],
    controllers: [LoginController],
})
export class LoginModule {}
