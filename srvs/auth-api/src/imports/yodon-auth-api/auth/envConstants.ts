import * as dotenv from "dotenv";

dotenv.config();

export const auth0domain = `https://${process.env.AUTH0_DOMAIN}`;
export const auth0client = process.env.AUTH0_CLIENT;
export const auth0clientSecret = process.env.AUTH0_CLIENTSECRET;
export const authApiRsaPrivate = process.env.AUTHAPI_RSA_PRIVATE.replace(
    "\\n",
    "\n",
);
