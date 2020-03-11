import { Module } from "@nestjs/common";

import { CryptoVerifyModule } from "../../yodon-cryptoVerify";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [CryptoVerifyModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
