import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as cryptoRandomString from "crypto-random-string";
import * as fetch from "isomorphic-fetch";

import {
    auth0audience,
    auth0client,
    auth0clientSecret,
    auth0domain,
    authErrorUrl,
} from "../../constants";
import { IUserApp, IUserVisible } from "."; // eslint-disable-line no-unused-vars

const logger = new Logger("auth.service.ts");

// TODO global state should be cluster-safe cache with automatic time-based expiration
const bannedUsers = {} as { [userId: string]: true };

const noUser = () => {
    return {
        userApp: null as IUserApp,
        userVisible: null as IUserVisible,
    };
};

const badLogin = () => {
    return {
        userApp: null as IUserApp,
        userVisible: null as IUserVisible,
        redirect: authErrorUrl,
    };
};

const getNewNonce = () => {
    const nonce = cryptoRandomString({ length: 10, type: "url-safe" });
    return nonce;
};

const getLoginUrl = (nonce: string, targetRoute: string) => {
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
        "&redirect_uri=http://localhost:3001/api/auth/postlogin" +
        "&state=" +
        targetRoute
    );
};

const getLogoutUrl = (targetRoute: string) => {
    return (
        auth0domain +
        "/v2/logout" +
        "?returnTo=http://localhost:3001" +
        targetRoute +
        "&client_id=" +
        auth0client
    );
};

const fetchAccessToken = (authCode: string) => {
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
};

const fetchUserInfoUsingTokens = async (tokens: {
    access_token: string;
    expires_in: number;
}) => {
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
        } = await res.json();
        // TODO pull extra user metadata info
        // checkIfUserIsInBannedUsersAndIfSoLogAndBan(user);
        // if (userHasAnyAccess(user)) {
        //     // TODO next line session.user or session.passport.user?
        //     session.user = userFromIdToken(idToken);
        // }
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
            } as IUserApp,
            userVisible: {
                loggedIn: true,
                pictureUrl: auth0user.picture,
                emailVerified: auth0user.email_verified,
            } as IUserVisible,
        };
    } catch (reason) {
        logger.warn(reason, "AuthService-fuiut-01");
        return noUser();
    }
};

const fetchUserInfoUsingAccessCode = async (accessCode: string) => {
    try {
        const fetchRes = await fetchAccessToken(accessCode);
        try {
            const tokens: {
                access_token: string;
                id_token: string;
                scope: string;
                expires_in: number;
                token_type: string;
            } = await fetchRes.json();
            try {
                const { userApp, userVisible } = await fetchUserInfoUsingTokens(
                    tokens,
                );
                return {
                    userApp,
                    userVisible,
                };
            } catch (reason) {
                logger.warn(reason, "AuthService-fuiuac-01");
                return noUser();
            }
        } catch (reason) {
            logger.warn(reason, "AuthService-fuiuac-02");
            return noUser();
        }
    } catch (reason) {
        logger.warn(reason, "auth-fuiuac-03");
        return noUser();
    }
};

const constructAppUrl = (state: string) => {
    // return "http://localhost:3001/";
    return "http://localhost:3001" + state;
};

@Injectable()
class AuthService {
    public getVisibleUserInfo() {}

    public prelogin(): string {
        const targetRoute = "/";
        const nonce = getNewNonce();
        const loginUrl = getLoginUrl(nonce, targetRoute);
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
            const { userApp, userVisible } = await fetchUserInfoUsingAccessCode(
                code,
            );
            if (userApp === null || userVisible === null) {
                logger.warn("bad login", "AuthService-postlogin-01");
                return badLogin();
            }
            const reactAppUrl = constructAppUrl(state);
            return {
                userApp,
                userVisible,
                redirect: reactAppUrl,
            };
        } catch (reason) {
            logger.warn(reason, "AuthService-postlogin-02");
            return badLogin();
        }
    }

    public prelogout(): string {
        const targetRoute = "/api/auth/postlogout";
        const loginUrl = getLogoutUrl(targetRoute);
        return loginUrl;
    }

    public postlogout(): string {
        const reactAppUrl = constructAppUrl("/");
        return reactAppUrl;
    }
}

export { AuthService };
