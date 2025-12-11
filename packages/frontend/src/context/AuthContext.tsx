import { useMutation, useQuery } from "@apollo/client/react";
import { createContext, ReactNode, useContext } from "react";
import { AUTH_STATUS_QUERY, LOGOUT_MUTATION } from "../graphql/queries/auth";
import type { AuthStatusData, User } from "../types";

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
    login: () => void;
    logout: () => Promise<void>;
    refetch: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode; }) {
    const { data, loading, error, refetch } = useQuery<AuthStatusData>(
        AUTH_STATUS_QUERY
    );
    const [logoutMutation] = useMutation(LOGOUT_MUTATION);

    const login = () => {
        window.location.href = "/auth/discord";
    };

    const logout = async () => {
        await logoutMutation();
        await refetch();
    };

    const value: AuthContextValue = {
        user: data?.authStatus.user ?? null,
        isAuthenticated: data?.authStatus.isAuthenticated ?? false,
        isLoading: loading,
        error: error ?? null,
        login,
        logout,
        refetch
    };

    return <AuthContext.Provider value={value}>{children}
    </AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
