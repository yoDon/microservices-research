import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationMiddleware } from "./common/authentication..middleware";
import { DemoModule } from "./demo/demo.module";

@Module({
    imports: [DemoModule],
    controllers: [AppController],
    providers: [AppService],
})
class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes({ path: "/demo", method: RequestMethod.POST });
    }
}

export { AppModule };
