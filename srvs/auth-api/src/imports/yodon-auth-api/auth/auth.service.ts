import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";

import { IUserApp, IUserInfo, IUserVisible } from "../../yodon-auth-types"; // eslint-disable-line no-unused-vars
import {
    CryptoSignService, // eslint-disable-line no-unused-vars
} from "../../yodon-cryptoSign";
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

    private fetchAccessToken(authCode: string) {
        const config:AxiosRequestConfig = {
            url: auth0domain + "/oauth/token",
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            data: {
                grant_type: "authorization_code",
                client_id: auth0client,
                client_secret: auth0clientSecret,
                code: authCode,
                redirect_uri: "http://localhost:3001/",
            },
        };
        return axios(config)
        .then((response) => {
            if (response.status === 200 || response.status === 304) {
                const tokens: {
                    access_token: string;
                    id_token: string;
                    scope: string;
                    expires_in: number;
                    token_type: string;
                } = response.data;
                return tokens;
            } else {
                logger.warn(response.status, "AuthService-fat-01");
                return null;
            }
        })
        .catch((reason) => {
            logger.warn(reason, "AuthService-fat-02");
            return null;
        });
    }

    private fetchUserInfoUsingTokens(tokens: {
        access_token: string;
        expires_in: number;
    }): Promise<IUserInfo> {
        const config:AxiosRequestConfig = {
            url: auth0domain + "/userinfo",
            method: "get",
            headers: {
                Authorization: "Bearer " + tokens.access_token,
                "content-type": "application/json",
            },
        };
        return axios(config)
        .then((res) => {
            const auth0user:
                | {
                    picture: string;
                    updated_at: string;
                    email: string;
                    email_verified: boolean;
                }
                | { [key: string]: any } = res.data;

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
        })
        .catch((reason) => {
            logger.warn(reason, "AuthService-fuiut-01");
            return this.noUser();
        });
    }

    private fetchUserInfoUsingAccessCode(
        accessCode: string,
    ): Promise<IUserInfo> {
        return this.fetchAccessToken(accessCode)
        .then((tokens) => {
            return this.fetchUserInfoUsingTokens(tokens);
        })
        .catch((reason) => {
            logger.warn(reason, "AuthService-fuiuac-01");
            return this.noUser();
        });
    }

    public getUserInfo(accessCode: string): Promise<IUserInfo> {
        return this.fetchUserInfoUsingAccessCode(accessCode)
        .then((userInfo) => {
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
        })
        .catch((reason) => {
            logger.warn(reason, "AuthService-getuserinfo-02");
            return this.noUser();
        });
    }
}

export { AuthService };
