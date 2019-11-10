import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service"; // eslint-disable-line no-unused-vars

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {} // eslint-disable-line no-unused-vars

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
