import type { PrismaClient, User } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../db/client.js";

export type GraphQLContext = {
    req: Request;
    res: Response;
    prisma: PrismaClient;
    user: User | null;
};

export async function createContext(
    { req, res }: { req: Request; res: Response; }
): Promise<GraphQLContext> {
    let user: User | null = null;

    if (req.session.userId) {
        user = await prisma.user.findUnique({
            where: { id: req.session.userId }
        });
    }

    return {
        req,
        res,
        prisma,
        user
    };
}
