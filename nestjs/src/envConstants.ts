export const port = process.env.PORT;
export const auth0domain = `https://${process.env.AUTH0_DOMAIN}`;
export const auth0audience = process.env.AUTH0_AUDIENCE;
export const auth0client = process.env.AUTH0_CLIENT;
export const auth0clientSecret = process.env.AUTH0_CLIENTSECRET;
export const cookieSecret = process.env.APP_COOKIESECRET || "TODO CHANGEME";
export const loginErrorUrl = process.env.LOGIN_ERRORURL;
