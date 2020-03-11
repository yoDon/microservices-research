import { Module } from "@nestjs/common"; // eslint-disable-line no-unused-vars

import { CryptoSignService } from "./cryptoSign.service";

@Module({
    exports: [CryptoSignService],
    imports: [],
    controllers: [],
    providers: [CryptoSignService],
})
class CryptoSignModule {}

export { CryptoSignModule };
