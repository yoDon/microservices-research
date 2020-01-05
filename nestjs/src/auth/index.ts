export type IUserApp = null | {
    accessToken: string;
    expiresAt: number;
    pictureUrl: string;
    updatedAt: string;
    email: string;
    emailVerified: boolean;
};

export type IUserVisible = null | {
    loggedIn: boolean;
    pictureUrl: string;
    emailVerified: boolean;
};

// export {
//     // IUserApp,
//     // IUserVisible,
// }
