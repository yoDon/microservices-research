import { Module } from "@nestjs/common";

import { CryptoSignModule } from "../cryptoSign/cryptoSign.module";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";

@Module({
    imports: [CryptoSignModule],
    providers: [LoginService],
    controllers: [LoginController],
})
export class LoginModule {}
