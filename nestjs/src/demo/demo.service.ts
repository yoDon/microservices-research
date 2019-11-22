import { Injectable } from "@nestjs/common";

import { ICreateDemoDto } from "./dto/create-demo.dto"; // eslint-disable-line no-unused-vars

@Injectable()
class DemoService {
    getDemo() {
        return "Hello World!";
    }

    async createDemo(arg: ICreateDemoDto) {
        // for demo example purposes, return a promise
        return new Promise((resolve) =>
            resolve("Hello World! one:" + arg.one + " two:" + arg.two),
        );
    }
}

export { DemoService };
