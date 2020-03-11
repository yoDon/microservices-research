import {
    Injectable,
    // Logger,
} from "@nestjs/common";

import { IUserApp, IUserInfo } from "."; // eslint-disable-line no-unused-vars

// const logger = new Logger("auth.service.ts");

@Injectable()
class AuthService {
    // TODO persist the list of banned users
    private bannedUsers = {} as { [email: string]: true };
    private activeUsers = {} as { [email: string]: number };

    public getUser(userInfo: IUserInfo) {
        return userInfo.userVisible;
    }

    public isBannedUser(email: string) {
        if (this.bannedUsers[email]) {
            return true;
        }
        return false;
    }

    public sawUser(email: string) {
        this.activeUsers[email] = Date.now();
    }
}

export { AuthService };
