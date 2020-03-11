import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { AuthModule } from "../imports/yodon-auth";

@Module({
    imports: [AuthModule],
})
class AppModule {}

export { AppModule };
