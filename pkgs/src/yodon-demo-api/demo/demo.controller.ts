import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { DemoService } from "./demo.service"; // eslint-disable-line no-unused-vars
import { CreateDemoDto } from "./dto/create-demo.dto"; // eslint-disable-line no-unused-vars
import { SignatureGuard } from "./signature.guard"; // eslint-disable-line no-unused-vars

@Controller("demo")
class DemoController {
    constructor(private readonly demoService: DemoService) {} // eslint-disable-line no-unused-vars

    @ApiOperation({ summary: "Demo endpoint with signature guard" })
    @ApiResponse({ status: 200, description: "Return Hello World response" })
    @UseGuards(SignatureGuard)
    @Get()
    getDemo() {
        return this.demoService.getDemo();
    }

    @ApiOperation({ summary: "Demo endpoint with DTO validation" })
    @ApiResponse({ status: 200, description: "Return Hello World response" })
    @Post()
    async createDemo(@Body() createDemoDto: CreateDemoDto) {
        return this.demoService.createDemo(createDemoDto);
    }
}

export { DemoController };
