import { PrismaClient } from "@prisma/client";
import { logger } from "../logger.js";

export const prisma = new PrismaClient();

export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
    logger.info("Database disconnected");
}
