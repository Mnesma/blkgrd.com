export type User = {
    id: string;
    discordId: string;
    username: string;
    displayName: string;
    avatar: string | null;
    avatarUrl: string;
    isAdmin: boolean;
};

export type AuthStatus = {
    isAuthenticated: boolean;
    user: User | null;
};

export type AuthStatusData = {
    authStatus: AuthStatus;
};
