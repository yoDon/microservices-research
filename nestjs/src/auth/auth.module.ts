import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CookieSerializer } from "./cookie.serializer";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [PassportModule.register({ session: true })],
    providers: [AuthService, CookieSerializer, JwtStrategy],
    controllers: [AuthController],
    exports: [PassportModule],
})
export class AuthModule {}
