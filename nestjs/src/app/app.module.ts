import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { AuthModule } from "../auth/auth.module";
import { DemoModule } from "../demo/demo.module";
import { LoginModule } from "../login/login.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [DemoModule, AuthModule, LoginModule],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {}

export { AppModule };
