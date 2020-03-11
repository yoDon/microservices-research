import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { AuthModule } from "../imports/yodon-auth-sdk";
import { CookieModule } from "../imports/yodon-cookie";
import { CryptoVerifyModule } from "../imports/yodon-cryptoVerify";
import { DemoModule } from "../imports/yodon-demo-sdk";
import { LoginModule } from "../imports/yodon-login-sdk";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [AuthModule, CookieModule, CryptoVerifyModule, DemoModule, LoginModule],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {}

export { AppModule };
