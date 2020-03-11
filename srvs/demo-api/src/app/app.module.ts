import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { DemoModule } from "../imports/yodon-demo";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [DemoModule],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {}

export { AppModule };
