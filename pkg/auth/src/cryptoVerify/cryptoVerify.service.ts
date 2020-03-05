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

const logger = new Logger("cryptoverify.service.ts");

@Injectable()
class CryptoVerifyService {
  private readonly publicPath = path.resolve("./.rsa.public");
  private readonly publicKey = fs.existsSync(this.publicPath)
    ? fs.readFileSync(this.publicPath, "utf8").trim()
    : "";

  public cryptoVerify(objectToSign: object, signature: string) {
    if (this.publicKey) {
      const verify = crypto.createVerify("SHA256");
      const text = stringify(objectToSign);
      verify.update(text);
      verify.end();
      const result = verify.verify(this.publicKey, signature, "base64");
      return result;
    } else {
      logger.error("Public key not found for signing", "cryptoverify");
      throw "Public key not found for signing";
    }
  }
}

export { CryptoVerifyService };
