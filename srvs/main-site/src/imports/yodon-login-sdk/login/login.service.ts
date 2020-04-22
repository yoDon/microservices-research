import { Injectable, Logger } from "@nestjs/common";
import * as cryptoRandomString from "crypto-random-string";
import axios, { AxiosRequestConfig } from "axios";

import { IUserApp, IUserInfo, IUserVisible } from "../../yodon-auth-types"; // eslint-disable-line no-unused-vars
import {
    auth0audience,
    auth0client,
    auth0domain,
    authApiDomain,
    authApiPort,
    loginErrorUrl,
} from "./envConstants";

const logger = new Logger("login.service.ts");

@Injectable()
class LoginService {
    // TODO persist the list of banned users
    private bannedUsers = {} as { [email: string]: true };
    private activeUsers = {} as { [email: string]: number };

    private noUser(): IUserInfo {
        return {
            userApp: null as IUserApp,
            userAppSignature: "",
            userVisible: null as IUserVisible,
            userVisibleSignature: "",
        };
    }

    private badLogin() {
        return {
            ...this.noUser(),
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

    private constructAppUrl(state: string) {
        return "http://localhost:3001" + state;
    }

    private fetchUserInfoUsingAccessCode(
        accessCode: string,
    ): Promise<IUserInfo> {
        const url =
            "http://" +
            authApiDomain +
            ":" +
            authApiPort +
            "/api/auth/userInfo?accessCode=" +
            accessCode;
        const config: AxiosRequestConfig = {
            url,
            method: "get",
            headers: {
                "content-type": "application/json",
            },
        };
        return axios(config)
        .then((response) => {
            if (response.status === 200 || response.status === 304) {
                return response.data;
            } else {
                logger.warn(response.status, "LoginService-fuiuac-01");
                return null; 
            }
        })
        .catch((error) => {
            logger.error(error, "LoginService-fuiuac-02");
            return null;
        });
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
        userAppSignature: string;
        userVisible: IUserVisible;
        userVisibleSignature: string;
        redirect: string;
    }> {
        try {
            const userInfo = await this.fetchUserInfoUsingAccessCode(code);
            if (
                userInfo.userApp === null ||
                userInfo.userVisible === null ||
                userInfo.userAppSignature === "" ||
                userInfo.userVisibleSignature === ""
            ) {
                logger.warn("bad login", "AuthService-postlogin-01");
                return this.badLogin();
            }
            const reactAppUrl = this.constructAppUrl(state);
            return {
                ...userInfo,
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
