import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { AppService } from "./app.service"; // eslint-disable-line no-unused-vars

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {} // eslint-disable-line no-unused-vars

    @ApiOperation({ title: "Confirm API is awake" })
    @ApiResponse({ status: 200, description: "Return Hello World response" })
    @Get()
    getHello() {
        return this.appService.getHello();
    }
}
