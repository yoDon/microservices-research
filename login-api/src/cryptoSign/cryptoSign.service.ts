import { Injectable, Logger } from "@nestjs/common";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import stringify from "safe-stable-stringify";

//
// To generate keys see
//    https://travistidwell.com/jsencrypt/index.html
//    https://travistidwell.com/jsencrypt/demo/index.html
//    https://nodejs.org/api/crypto.html#crypto_class_sign
//

const logger = new Logger("cyptosign.service.ts");

@Injectable()
class CryptoSignService {
    private readonly privatePath = path.resolve("./.rsa.private");
    private readonly privateKey = fs.existsSync(this.privatePath)
        ? fs.readFileSync(this.privatePath, "utf8").trim()
        : "";

    public cryptoSign(objectToSign: object) {
        if (this.privateKey) {
            const sign = crypto.createSign("SHA256");
            const text = stringify(objectToSign);
            sign.update(text);
            sign.end();
            const signature = sign.sign(this.privateKey, "base64");
            return signature;
        } else {
            logger.error("Private key not found for signing", "cryptosign");
            throw "Private key not found for signing";
        }
    }
}

export { CryptoSignService };
