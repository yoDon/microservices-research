import { Injectable, Logger } from "@nestjs/common";
import * as crypto from "crypto";
import stringify from "safe-stable-stringify";

import { loginApiRsaPublic } from "../auth/envConstants";

//
// To generate keys see
//    https://travistidwell.com/jsencrypt/index.html
//    https://travistidwell.com/jsencrypt/demo/index.html
//    https://nodejs.org/api/crypto.html#crypto_class_sign
//

const logger = new Logger("cryptoverify.service.ts");

@Injectable()
class CryptoVerifyService {
  private readonly publicKey = loginApiRsaPublic;

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
