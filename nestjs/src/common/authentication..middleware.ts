import { NestMiddleware } from "@nestjs/common"; // eslint-disable-line no-unused-vars
import * as jwt from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";

const auth0audience = "http://localhost:3001";
const auth0domain = "https://dev-h-vc-i52.auth0.com";

class AuthenticationMiddleware implements NestMiddleware {
    use(req, res, next) {
        jwt({
            secret: expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: auth0domain + "/.well-known/jwks.json",
            }),
            audience: auth0audience,
            issuer: auth0domain + "/",
            algorithm: "RS256",
        })(req, res, (err) => {
            if (err) {
                const status = err.status || 500;
                const message =
                    err.message ||
                    "Sorry, we were unable to process your request.";
                return res.status(status).send({
                    message,
                });
            }
            next();
        });
    }
}

export { AuthenticationMiddleware };
