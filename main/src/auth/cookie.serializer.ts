// see https://github.com/nestjs/docs.nestjs.com/issues/237

import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
class CookieSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: any, id?: any) => void): void {
        done(null, user);
    }

    deserializeUser(payload: any, done: (err: any, id?: any) => void): void {
        done(null, payload);
    }
}

export { CookieSerializer };
