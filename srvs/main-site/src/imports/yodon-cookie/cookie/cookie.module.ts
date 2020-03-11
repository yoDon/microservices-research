import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CookieSessionModule } from "nestjs-cookie-session";

import { CookieSerializer } from "./cookie.serializer";
import { cookieSecret } from "./envConstants";

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
    providers: [CookieSerializer],
    controllers: [],
})
export class CookieModule {}
