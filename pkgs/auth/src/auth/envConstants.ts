import * as dotenv from "dotenv";

dotenv.config();

export const cookieSecret = process.env.APP_COOKIESECRET;
export const loginApiRsaPublic = process.env.LOGINAPI_RSA_PUBLIC;
