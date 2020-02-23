import { 
    Injectable,
    // Logger,
} from "@nestjs/common";
import { IUserApp, IUserInfo } from ".";

// const logger = new Logger("auth.service.ts");

@Injectable()
class AuthService {

    // TODO persist the list of banned users
    private bannedUsers = {} as { [email: string]: true };
    private activeUsers = {} as { [email: string]: number };

    public getUserInfo(user: IUserApp): IUserInfo {
        let userinfo:IUserApp = { ...user };
        delete userinfo.accessToken;
        delete userinfo.expiresAt;
        delete userinfo.updatedAt;
        return userinfo;
    }

    public isBannedUser(email: string) {
        if (this.bannedUsers[email])
        {
            return true;
        }
        return false;
    }

    public sawUser(email: string) {
        this.activeUsers[email] = Date.now();
    }
}

export { AuthService };
