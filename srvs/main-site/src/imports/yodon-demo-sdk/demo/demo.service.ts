import { Injectable } from "@nestjs/common";
import * as fetch from "isomorphic-fetch";

import { demoApiDomain, demoApiPort } from "./envConstants";

@Injectable()
class DemoService {
    async getDemo() {
        const url = "http://" + demoApiDomain + ":" + demoApiPort + "/api/demo";
        const contents = {
            method: "GET",
            headers: {
                "content-type": "text/html",
            },
        };
        const fetchRes = await fetch(url, contents);
        const result = await fetchRes.text();
        return result + " by way of the sdk and api";
    }
}

export { DemoService };
