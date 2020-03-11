import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { AuthModule } from "../imports/yodon-auth-sdk";
import { CookieModule } from "../imports/yodon-cookie";
import { CryptoVerifyModule } from "../imports/yodon-cryptoVerify";
import { DemoModule } from "../imports/yodon-demo-sdk";
import { LoginModule } from "../imports/yodon-login-sdk";

@Module({
    imports: [
        AuthModule,
        CookieModule,
        CryptoVerifyModule,
        DemoModule,
        LoginModule,
    ],
})
class AppModule {}

export { AppModule };
