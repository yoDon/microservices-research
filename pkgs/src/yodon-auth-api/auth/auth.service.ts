import { Injectable, Logger } from "@nestjs/common";
import * as fetch from "isomorphic-fetch";

import {
    CryptoSignService, // eslint-disable-line no-unused-vars
} from "../../yodon-cryptoSign";
import { IUserApp, IUserInfo, IUserVisible } from "../../yodon-auth-types"; // eslint-disable-line no-unused-vars
import { auth0client, auth0clientSecret, auth0domain } from "./envConstants";

const logger = new Logger("auth.service.ts");

@Injectable()
class AuthService {
    constructor(
        private readonly cryptoSignService: CryptoSignService, // eslint-disable-line no-unused-vars
    ) {}

    public noUser(): IUserInfo {
        return {
            userApp: null as IUserApp,
            userAppSignature: "",
            userVisible: null as IUserVisible,
            userVisibleSignature: "",
        };
    }

    private async fetchAccessToken(authCode: string) {
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
        const fetchRes = await fetch(url, contents);
        const tokens: {
            access_token: string;
            id_token: string;
            scope: string;
            expires_in: number;
            token_type: string;
        } = await fetchRes.json();
        return tokens;
    }

    private async fetchUserInfoUsingTokens(tokens: {
        access_token: string;
        expires_in: number;
    }): Promise<IUserInfo> {
        const url = auth0domain + "/userinfo";
        const contents = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + tokens.access_token,
                "content-type": "application/json",
            },
        };
        try {
            const res = await fetch(url, contents);
            const auth0user:
                | {
                      picture: string;
                      updated_at: string;
                      email: string;
                      email_verified: boolean;
                  }
                | { [key: string]: any } = await res.json();

            const userApp: IUserApp = {
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
            };
            const userVisible: IUserVisible = {
                loggedIn: true,
                pictureUrl: auth0user.picture,
                emailVerified: auth0user.email_verified,
            };
            const userAppSignature = this.cryptoSignService.cryptoSign(userApp);
            const userVisibleSignature = this.cryptoSignService.cryptoSign(
                userVisible,
            );
            const userInfo: IUserInfo = {
                userApp,
                userAppSignature,
                userVisible,
                userVisibleSignature,
            };
            return userInfo;
        } catch (reason) {
            logger.warn(reason, "AuthService-fuiut-01");
            return this.noUser();
        }
    }

    private async fetchUserInfoUsingAccessCode(
        accessCode: string,
    ): Promise<IUserInfo> {
        try {
            const tokens = await this.fetchAccessToken(accessCode);
            try {
                try {
                    const userInfo: IUserInfo = await this.fetchUserInfoUsingTokens(
                        tokens,
                    );
                    return userInfo;
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

    public async getUserInfo(accessCode: string): Promise<IUserInfo> {
        try {
            const userInfo = await this.fetchUserInfoUsingAccessCode(
                accessCode,
            );
            if (
                userInfo.userApp === null ||
                userInfo.userVisible === null ||
                userInfo.userAppSignature === "" ||
                userInfo.userVisibleSignature === ""
            ) {
                logger.warn("bad identity", "AuthService-getuserinfo-01");
                return this.noUser();
            }
            return userInfo;
        } catch (reason) {
            logger.warn(reason, "AuthService-getuserinfo-02");
            return this.noUser();
        }
    }
}

export { AuthService };
