import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { DemoService } from "./demo.service"; // eslint-disable-line no-unused-vars
import { CreateDemoDto } from "./dto/create-demo.dto"; // eslint-disable-line no-unused-vars

@Controller("demo")
class DemoController {
    constructor(private readonly demoService: DemoService) {} // eslint-disable-line no-unused-vars

    @ApiOperation({ summary: "Demo endpoint" })
    @ApiResponse({ status: 200, description: "Return Hello World response" })
    @Get()
    getDemo() {
        return this.demoService.getDemo();
    }

    // curl -H "Content-Type: application/json" -d "{ \"one\": \"Some\", \"two\": \"Text\" }" http://localhost:3001/api/demo
    @ApiOperation({ summary: "Demo endpoint" })
    @ApiResponse({ status: 200, description: "Demo DTO validation" })
    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createDemo(@Body() createDemoDto: CreateDemoDto) {
        return this.demoService.createDemo(createDemoDto);
    }
}

export { DemoController };
