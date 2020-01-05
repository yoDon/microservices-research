import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars
import {
    CookieSessionModule,
    NestCookieSessionOptions, // eslint-disable-line no-unused-vars
} from "nestjs-cookie-session";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DemoModule } from "./demo/demo.module";

@Module({
    imports: [
        DemoModule,
        AuthModule,
        CookieSessionModule.forRoot({
            session: {
                secret: process.env.APP_COOKIESECRET || "TODO CHANGEME",
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {}

export { AppModule };
