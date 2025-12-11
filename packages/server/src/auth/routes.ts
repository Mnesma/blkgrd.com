import { generateState } from "arctic";
import { Router } from "express";
import { env } from "../config/environment.js";
import { prisma } from "../db/client.js";
import { logger } from "../logger.js";
import {
    discord,
    DISCORD_SCOPES,
    fetchDiscordUser,
    isUserInRequiredGuild
} from "./discord.js";

export const authRouter = Router();

authRouter.get("/discord", (req, res) => {
    const state = generateState();
    const url = discord.createAuthorizationURL(state, null, DISCORD_SCOPES);

    req.session.oauthState = state;

    res.redirect(url.toString());
});

authRouter.get("/discord/callback", async (req, res) => {
    const { code, state } = req.query;

    if (!state || state !== req.session.oauthState) {
        return res.redirect(`${env.FRONTEND_URL}/auth-error`);
    }

    delete req.session.oauthState;

    if (!code || typeof code !== "string") {
        return res.redirect(`${env.FRONTEND_URL}/auth-error`);
    }

    try {
        const tokens = await discord.validateAuthorizationCode(code, null);
        const accessToken = tokens.accessToken();

        const isInGuild = await isUserInRequiredGuild(accessToken);
        if (!isInGuild) {
            return res.redirect(`${env.FRONTEND_URL}/join-server`);
        }

        const { id: discordId, username, global_name, avatar } =
            await fetchDiscordUser(accessToken);
        const displayName = global_name ?? username;

        const user = await prisma.user.upsert({
            where: { discordId },
            update: { username, displayName, avatar },
            create: { discordId, username, displayName, avatar }
        });

        req.session.userId = user.id;
        req.session.discordId = user.discordId;

        res.redirect(env.FRONTEND_URL);
    } catch (error) {
        logger.error("OAuth callback error", { error: String(error) });
        res.redirect(`${env.FRONTEND_URL}/auth-error`);
    }
});

authRouter.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            logger.error("Session destroy error", { error: String(error) });
            return res.status(500).json({ success: false });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true });
    });
});

authRouter.get("/status", async (req, res) => {
    if (!req.session.userId) {
        return res.json({ isAuthenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
        where: { id: req.session.userId }
    });

    res.json({
        isAuthenticated: !!user,
        user: user ? { id: user.id, discordId: user.discordId } : null
    });
});

declare module "express-session" {
    interface SessionData {
        oauthState?: string;
        userId?: string;
        discordId?: string;
    }
}
