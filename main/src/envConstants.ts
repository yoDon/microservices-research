import * as dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const auth0domain = `https://${process.env.AUTH0_DOMAIN}`;
export const auth0audience = process.env.AUTH0_AUDIENCE;
export const auth0client = process.env.AUTH0_CLIENT;
export const cookieSecret = process.env.APP_COOKIESECRET;
export const loginApiDomain = process.env.LOGINAPI_DOMAIN;
export const loginApiPort = process.env.LOGINAPI_PORT;
export const loginErrorUrl = process.env.LOGIN_ERRORURL;
