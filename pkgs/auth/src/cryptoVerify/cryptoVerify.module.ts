import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { CryptoVerifyService } from "./cryptoVerify.service";

@Module({
  exports: [CryptoVerifyService],
  imports: [],
  controllers: [],
  providers: [CryptoVerifyService]
})
class CryptoVerifyModule {}

export { CryptoVerifyModule };
