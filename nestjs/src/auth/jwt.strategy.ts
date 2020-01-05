import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as dotenv from "dotenv";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";

dotenv.config();

const logger = new Logger("JwtStrategy");

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
            }),
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter("id_token"),
            ]),
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `${process.env.AUTH0_DOMAIN}/`,
            algorithms: ["RS256"],
        });
    }

    validate(payload: any) {
        logger.log("In JwtStrategy.validate");
        logger.log(payload);
        return payload;
    }
}

export { JwtStrategy };
