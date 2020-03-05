import * as dotenv from "dotenv";

dotenv.config();

export const auth0domain = `https://${process.env.AUTH0_DOMAIN}`;
export const auth0client = process.env.AUTH0_CLIENT;
export const auth0clientSecret = process.env.AUTH0_CLIENTSECRET;
