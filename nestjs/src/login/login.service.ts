import {
    Injectable,
    Logger,
} from "@nestjs/common";
import * as cryptoRandomString from "crypto-random-string";
import * as fetch from "isomorphic-fetch";

import {
    auth0audience,
    auth0client,
    auth0clientSecret,
    auth0domain,
    loginErrorUrl,
} from "../constants";
import { IUserApp, IUserVisible } from "../auth"; // eslint-disable-line no-unused-vars

const logger = new Logger("login.service.ts");

@Injectable()
class LoginService {

    // TODO persist the list of banned users
    private bannedUsers = {} as { [email: string]: true };
    private activeUsers = {} as { [email: string]: number };

    private noUser() {
        return {
            userApp: null as IUserApp,
            userVisible: null as IUserVisible,
        };
    }

    private badLogin() {
        return {
            userApp: null as IUserApp,
            userVisible: null as IUserVisible,
            redirect: loginErrorUrl,
        };
    }

    private getNewNonce() {
        const nonce = cryptoRandomString({ length: 10, type: "url-safe" });
        return nonce;
    }

    private getLoginUrl(nonce: string, targetRoute: string) {
        return (
            auth0domain +
            "/authorize" +
            "?audience=" +
            auth0audience +
            "&scope=openid profile email" +
            "&response_type=code" +
            "&nonce=" +
            nonce +
            "&client_id=" +
            auth0client +
            "&redirect_uri=http://localhost:3001/api/login/postlogin" +
            "&state=" +
            targetRoute
        );
    }

    private getLogoutUrl(targetRoute: string) {
        return (
            auth0domain +
            "/v2/logout" +
            "?returnTo=http://localhost:3001" +
            targetRoute +
            "&client_id=" +
            auth0client
        );
    }

    private fetchAccessToken(authCode: string) {
        const url = auth0domain + "/oauth/token";
        const contents = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: auth0client,
                client_secret: auth0clientSecret,
                code: authCode,
                redirect_uri: "http://localhost:3001/",
            }),
        };
        // const test = "curl --request POST "
        //     + "--url " + auth0domain + "/oauth/token "
        //     + "--header \"content-type=application/x-www-form-urlencoded\" "
        //     + "--data \"grant_type=authorization_code\" "
        //     + "--data \"client_id=" + auth0client + "\" "
        //     + "--data \"client_secret=" + auth0clientSecret + "\" "
        //     + "--data \"code=" + authCode + "\" "
        //     + "--data \"redirect_uri=http://localhost:3001/\"";
        // logger.log(test);
        return fetch(url, contents);
    }

    private async fetchUserInfoUsingTokens(tokens: {
        access_token: string;
        expires_in: number;
    }) {
        const url = auth0domain + "/userinfo";
        const contents = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + tokens.access_token,
                "content-type": "application/json",
            },
        };
        // const test = "curl --request GET "
        //     + "--url " + auth0domain + "/userinfo "
        //     + "--header \"Authorization: Bearer " + accessToken\" "
        //     + "--header \"content-type=application/x-www-form-urlencoded\" "
        // logger.log(test);
        try {
            const res = await fetch(url, contents);
            const auth0user: {
                picture: string;
                updated_at: string;
                email: string;
                email_verified: boolean;
            } | { [key:string]:any } = await res.json();

            if (this.isBannedUser(auth0user.email))
            {
                logger.warn("bannedUser: " + auth0user.email, "AuthService-fuiut-02");
                return this.noUser();   
            }
            return {
                userApp: {
                    accessToken: tokens.access_token,
                    //
                    // NOTE: JWT expires_in has units of seconds, javascript times are in milliseconds
                    //
                    expiresAt: Date.now() + tokens.expires_in * 1000,
                    pictureUrl: auth0user.picture,
                    updatedAt: auth0user.updated_at,
                    email: auth0user.email,
                    emailVerified: auth0user.email_verified,
                    roles: JSON.parse(auth0user["https://example.com/roles"]),
                } as IUserApp,
                userVisible: {
                    loggedIn: true,
                    pictureUrl: auth0user.picture,
                    emailVerified: auth0user.email_verified,
                } as IUserVisible,
            };
        } catch (reason) {
            logger.warn(reason, "AuthService-fuiut-01");
            return this.noUser();
        }
    }

    private async fetchUserInfoUsingAccessCode(accessCode: string) {
        try {
            const fetchRes = await this.fetchAccessToken(accessCode);
            try {
                const tokens: {
                    access_token: string;
                    id_token: string;
                    scope: string;
                    expires_in: number;
                    token_type: string;
                } = await fetchRes.json();
                try {
                    const { userApp, userVisible } = await this.fetchUserInfoUsingTokens(
                        tokens,
                    );
                    return {
                        userApp,
                        userVisible,
                    };
                } catch (reason) {
                    logger.warn(reason, "AuthService-fuiuac-01");
                    return this.noUser();
                }
            } catch (reason) {
                logger.warn(reason, "AuthService-fuiuac-02");
                return this.noUser();
            }
        } catch (reason) {
            logger.warn(reason, "auth-fuiuac-03");
            return this.noUser();
        }
    }

    private constructAppUrl(state: string) {
        return "http://localhost:3001" + state;
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

    public prelogin(): string {
        const targetRoute = "/";
        const nonce = this.getNewNonce();
        const loginUrl = this.getLoginUrl(nonce, targetRoute);
        return loginUrl;
    }

    public async postlogin(
        code: string,
        state: string,
    ): Promise<{
        userApp: IUserApp;
        userVisible: IUserVisible;
        redirect: string;
    }> {
        try {
            const { userApp, userVisible } = await this.fetchUserInfoUsingAccessCode(
                code,
            );
            if (userApp === null || userVisible === null) {
                logger.warn("bad login", "AuthService-postlogin-01");
                return this.badLogin();
            }
            const reactAppUrl = this.constructAppUrl(state);
            return {
                userApp,
                userVisible,
                redirect: reactAppUrl,
            };
        } catch (reason) {
            logger.warn(reason, "AuthService-postlogin-02");
            return this.badLogin();
        }
    }

    public prelogout(): string {
        const targetRoute = "/api/login/postlogout";
        const loginUrl = this.getLogoutUrl(targetRoute);
        return loginUrl;
    }

    public postlogout(): string {
        const reactAppUrl = this.constructAppUrl("/");
        return reactAppUrl;
    }
}

export { LoginService };
