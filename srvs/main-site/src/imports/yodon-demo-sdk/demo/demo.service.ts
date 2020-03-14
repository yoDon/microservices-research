import { Injectable } from "@nestjs/common";
import * as httpSignature from "http-signature";
// import * as fetch from "isomorphic-fetch";
import * as https from "https";

import { demoApiDomain, demoApiPort, demoSdkRsaPrivate } from "./envConstants";

@Injectable()
class DemoService {
    getDemo() {
        // const url = "http://" + demoApiDomain + ":" + demoApiPort + "/api/demo";
        const options = {
            host: demoApiDomain,
            port: demoApiPort,
            path: "/api/demo",
            method: "GET",
            headers: {},
        };
        const req = https.request(options, function(res) {
            console.log(res.statusCode);
        });
        httpSignature.sign(req, {
            key: demoSdkRsaPrivate,
            keyId: "foo",
        });
        req.end();

        // const contents = {
        //     method: "GET",
        //     headers: {
        //         "content-type": "text/html",
        //     },
        // };
        // const fetchRes = await fetch(url, contents);
        // const result = await fetchRes.text();

        const result = "hack";
        return result + " by way of the sdk and api";
    }
}

export { DemoService };
