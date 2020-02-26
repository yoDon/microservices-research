import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { LoginModule } from "../login/login.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [LoginModule],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {}

export { AppModule };
