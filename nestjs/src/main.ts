import {
    // Logger,
    ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
    NestExpressApplication, // eslint-disable-line no-unused-vars
} from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import * as passport from "passport";
import { join } from "path";

import { AppModule } from "./app.module";

dotenv.config();

// const logger = new Logger("main.ts");

async function bootstrap() {
    const appOptions = {
        cors: true,
        logger: console,
    };
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        appOptions,
    );
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");

    const options = new DocumentBuilder()
        // .setTitle('NestJS Example App')
        // .setDescription('API description')
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);

    app.useStaticAssets(join(__dirname, "../dist_client"));

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT);
}
bootstrap();
