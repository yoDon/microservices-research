import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";

import { demoApiDomain, demoApiPort } from "./envConstants";

@Injectable()
class DemoService {
    getDemo() {
        const config: AxiosRequestConfig = {
            url: "http://" + demoApiDomain + ":" + demoApiPort + "/api/demo",
            method: "get",
            headers: {
                "content-type": "text/html",
            },
        };
        return axios(config)
        .then((res) => {
           return res + " by way of the sdk and api";
        })
        .catch(() => {
            return "error";
        });
    }
}

export { DemoService };
