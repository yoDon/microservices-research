import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";

import { ValidationPipe } from "../common/ValidationPipe";
import { DemoService } from "./demo.service"; // eslint-disable-line no-unused-vars
import { CreateDemoDto } from "./dto/create-demo.dto"; // eslint-disable-line no-unused-vars

@Controller("demo")
class DemoController {
    constructor(private readonly demoService: DemoService) {} // eslint-disable-line no-unused-vars

    @ApiUseTags("demo")
    @ApiOperation({ title: "Demo endpoint" })
    @ApiResponse({ status: 200, description: "Return Hello World response" })
    @Get()
    getDemo() {
        return this.demoService.getDemo();
    }

    // curl -H "Content-Type: application/json" -d "{ \"one\": \"Some\", \"two\": \"Text\" }" http://localhost:3001/api/demo
    @ApiUseTags("demo")
    @ApiOperation({ title: "Demo endpoint" })
    @ApiResponse({ status: 200, description: "Demo DTO validation" })
    @Post()
    @UsePipes(new ValidationPipe())
    async createDemo(@Body() createDemoDto: CreateDemoDto) {
        return this.demoService.createDemo(createDemoDto);
    }
}

export { DemoController };
