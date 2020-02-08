import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CookieSerializer } from "./cookie.serializer";

@Module({
    imports: [PassportModule.register({ session: true })],
    providers: [AuthService, CookieSerializer],
    controllers: [AuthController],
    exports: [PassportModule],
})
export class AuthModule {}
