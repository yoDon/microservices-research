import { Module } from "@nestjs/common";

import { DemoController } from "./demo.controller";
import { DemoService } from "./demo.service";

@Module({
    imports: [],
    controllers: [DemoController],
    providers: [DemoService],
})
class DemoModule {}

export { DemoModule };
