import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";

import { AppModule } from "./app.module";

dotenv.config();

async function bootstrap() {
    const appOptions = { cors: true };
    const app = await NestFactory.create(AppModule, appOptions);
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

    await app.listen(process.env.PORT);
}
bootstrap();
