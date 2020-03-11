import { AdminGuard } from "./admin.guard";
import { AuthController } from "./auth.controller";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { UserGuard } from "./user.guard";

export type IUserApp = null | {
    accessToken: string;
    email: string;
    emailVerified: boolean;
    expiresAt: number;
    pictureUrl: string;
    roles?: {
        [role: string]: boolean;
    };
    updatedAt: string;
};

export type IUserVisible = null | {
    emailVerified: boolean;
    loggedIn: boolean;
    pictureUrl: string;
};

export type IUserInfo = null | {
    userApp: IUserApp | null;
    userAppSignature: string;
    userVisible: IUserVisible | null;
    userVisibleSignature: string;
};

export {
    AdminGuard,
    AuthController,
    AuthModule,
    AuthService,
    // IUserApp,
    // IUserInfo,
    // IUserVisible,
    UserGuard,
};
