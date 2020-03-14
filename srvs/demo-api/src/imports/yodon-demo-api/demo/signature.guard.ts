// see https://github.com/nestjs/docs.nestjs.com/issues/237

import {
    CanActivate, // eslint-disable-line no-unused-vars
    ExecutionContext, // eslint-disable-line no-unused-vars
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import * as httpSignature from "http-signature";

import { demoApiRsaPublic } from "./envConstants";

const logger = new Logger("signature.guard.ts");

//
// Require caller to be signed in with a non-banned user account
//
@Injectable()
class SignatureGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        try {
            //
            // RSA notes
            //     Encryption and Signing are different. Either:
            //         Encrypt with public key, Decrypt with private key
            //         Sign with private key, Verify with public key
            //     In zero-trust microservices architecture
            //         SDK needs private key
            //             SDK signs requests to prove it's the sender
            //             SDK decrypts response hashes to trust they are from API
            //             SDK trusts SSL to keep contents of messages private
            //         API needs public key to veryify messages are correctly signed
            //             API verifys requests to trust they are from SDK
            //             API encrypts hash of response to prove it's the sender
            //             API trusts SSL to keep contents of messages private
            //     Care of RSA keys
            //         Public key can be extracted from private key
            //         Private key can not be extracted from public key
            //         Public key may still need to be controlled to limit who can sign
            //
            const parsed: { keyId: string } = httpSignature.parseRequest(
                request,
            );
            if (!httpSignature.verifySignature(parsed, demoApiRsaPublic)) {
                logger.warn("invalid signature", "ca-02");
                return false;
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}

export { SignatureGuard };
