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
// TODO import * as session from "express-session";
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
        .setBasePath("api")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);

    app.useStaticAssets(join(__dirname, "../dist_client"));

    /* TODO remove
    app.use(
        session({
            secret: process.env.APP_COOKIESECRET || "TODO CHANGEME",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
            },
        }),
    );
    */
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT);
}
bootstrap();
