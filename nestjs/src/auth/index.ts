export type IUserApp = null | {
    accessToken: string;
    email: string;
    emailVerified: boolean;
    expiresAt: number;
    pictureUrl: string;
    roles?: {
        [role:string]: boolean;
    };
    updatedAt: string;
};

export type IUserVisible = null | {
    emailVerified: boolean;
    loggedIn: boolean;
    pictureUrl: string;
};

export type IUserInfo = null | {
    email: string;
    emailVerified: boolean;
    pictureUrl: string;
    roles?: {
        [role:string]: boolean;
    };
}

// export {
//     // IUserApp,
//     // IUserVisible,
// }
