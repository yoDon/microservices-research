import { Module } from "@nestjs/common";

import { CryptoSignModule } from "../../yodon-cryptoSign";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [CryptoSignModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
