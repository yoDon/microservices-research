import * as dotenv from "dotenv";

dotenv.config();

export const demoApiRsaPublic = process.env.DEMOAPI_RSA_PUBLIC.replace(
    "\\n",
    "\n",
);
