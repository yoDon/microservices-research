import auth0 from "auth0-js";

import { auth0audience, auth0client, auth0domain } from "../../constants";

const redirectUri = "http://localhost:3000/postlogin";
const returnTo = "http://localhost:3000/postlogout";

class Auth {
    private readonly auth0: auth0.WebAuth;
    private idToken = "";
    private expiresAt = 0;
    private profile: any;

    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: auth0domain,
            audience: auth0audience,
            clientID: auth0client,
            redirectUri,
            responseType: "id_token",
            scope: "openid profile",
        });
    }

    public getProfile = () => {
        return this.profile;
    };

    public getIdToken = () => {
        return this.idToken;
    };

    public isAuthenticated = () => {
        return new Date().getTime() < this.expiresAt;
    };

    public signIn = () => {
        this.auth0.authorize();
    };

    public handleAuthentication = () => {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, authResult) => {
                if (err) {
                    return reject(err);
                }
                if (!authResult || !authResult.idToken) {
                    return reject(err);
                }
                this.idToken = authResult.idToken;
                this.profile = authResult.idTokenPayload;
                // set the time that the id token will expire at
                this.expiresAt = authResult.idTokenPayload.exp * 1000;
                resolve();
            });
        });
    };

    public signOut = () => {
        // clear id token, profile, and expiration
        this.idToken = "";
        this.profile = null;
        this.expiresAt = 0;
        this.auth0.logout({
            returnTo,
            clientID: auth0client,
        });
    };
}

const auth0Client = new Auth();

export { auth0Client };
