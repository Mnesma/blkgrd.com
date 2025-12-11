import type { User } from "@prisma/client";
import { getAvatarUrl } from "../auth/discord.js";
import type { GraphQLContext } from "./context.js";

export const resolvers = {
    User: {
        avatarUrl: (user: User) => getAvatarUrl(user.discordId, user.avatar),
        roles: (user: User) => JSON.parse(user.roles) as string[],
        createdAt: (user: User) => user.createdAt.toISOString(),
        updatedAt: (user: User) => user.updatedAt.toISOString()
    },

    Query: {
        me: (_: unknown, __: unknown, context: GraphQLContext) => {
            return context.user;
        },

        authStatus: (_: unknown, __: unknown, context: GraphQLContext) => {
            return {
                isAuthenticated: !!context.user,
                user: context.user
            };
        }
    },

    Mutation: {
        logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
            return new Promise<boolean>((resolve, reject) => {
                context.req.session.destroy((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    context.res.clearCookie("connect.sid");
                    resolve(true);
                });
            });
        }
    }
};
