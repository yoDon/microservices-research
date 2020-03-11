import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { AuthModule } from "../imports/yodon-auth";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {}

export { AppModule };
