import { Injectable } from "@nestjs/common";

import { ICreateDemoDto } from "./dto/create-demo.dto"; // eslint-disable-line no-unused-vars

@Injectable()
export class DemoService {
    getDemo(): string {
        return "Hello World!";
    }

    createDemo(arg: ICreateDemoDto): string {
        return "Hello World! one:" + arg.one + " two:" + arg.two;
    }
}
