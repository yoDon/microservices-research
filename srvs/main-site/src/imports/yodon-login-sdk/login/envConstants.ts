import * as dotenv from "dotenv";

dotenv.config();

export const auth0domain = `https://${process.env.AUTH0_DOMAIN}`;
export const auth0audience = process.env.AUTH0_AUDIENCE;
export const auth0client = process.env.AUTH0_CLIENT;
export const cookieSecret = process.env.APP_COOKIESECRET;
export const authApiDomain = process.env.AUTHAPI_DOMAIN;
export const authApiPort = process.env.AUTHAPI_PORT;
export const loginErrorUrl = process.env.LOGIN_ERRORURL;
