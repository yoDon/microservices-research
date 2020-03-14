import * as dotenv from "dotenv";

dotenv.config();

export const demoApiDomain = process.env.DEMOAPI_DOMAIN;
export const demoApiPort = process.env.DEMOAPI_PORT;
export const demoSdkRsaPrivate = process.env.DEMOSDK_RSA_PRIVATE.replace(
    "\\n",
    "\n",
);
