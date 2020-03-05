import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CookieSessionModule } from "nestjs-cookie-session";

import { CryptoVerifyModule } from "../cryptoVerify/cryptoVerify.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CookieSerializer } from "./cookie.serializer";
import { cookieSecret } from "./envConstants";

@Module({
  imports: [
    PassportModule.register({ session: true }),
    CookieSessionModule.forRoot({
      session: {
        secret: cookieSecret,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
      }
    }),
    CryptoVerifyModule
  ],
  providers: [AuthService, CookieSerializer],
  controllers: [AuthController]
})
export class AuthModule {}
