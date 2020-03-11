import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { DemoModule } from "../imports/yodon-demo-api";

@Module({
    imports: [DemoModule],
})
class AppModule {}

export { AppModule };
