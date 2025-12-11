import { Discord } from "arctic";
import { z } from "zod";
import { env } from "../config/environment.js";
import { logger } from "../logger.js";

export const discord = new Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    env.DISCORD_CALLBACK_URL
);

export const DISCORD_SCOPES = ["identify", "guilds"];

const DiscordUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.string().nullable(),
    avatar: z.string().nullable(),
    email: z.string().optional()
});

const DiscordGuildSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string().nullable(),
    owner: z.boolean(),
    permissions: z.string()
});

const DiscordGuildArraySchema = z.array(DiscordGuildSchema);

export type DiscordUser = z.infer<typeof DiscordUserSchema>;
export type DiscordGuild = z.infer<typeof DiscordGuildSchema>;

export async function fetchDiscordUser(
    accessToken: string
): Promise<DiscordUser> {
    const response = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const error = `Failed to fetch Discord user: ${response.status}`;
        logger.error(error);
        throw new Error(error);
    }

    return DiscordUserSchema.parse(await response.json());
}

export async function fetchUserGuilds(
    accessToken: string
): Promise<DiscordGuild[]> {
    const response = await fetch(
        "https://discord.com/api/v10/users/@me/guilds",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        const error = `Failed to fetch user guilds: ${response.status}`;
        logger.error(error);
        throw new Error(error);
    }

    return DiscordGuildArraySchema.parse(await response.json());
}

export async function isUserInRequiredGuild(
    accessToken: string
): Promise<boolean> {
    const guilds = await fetchUserGuilds(accessToken);
    return guilds.some((guild) => env.DISCORD_GUILD_IDS.includes(guild.id));
}

export function getAvatarUrl(
    userId: string,
    avatarHash: string | null,
    size = 128
): string {
    if (avatarHash) {
        const extension = avatarHash.startsWith("a_") ? "gif" : "png";
        return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=${size}`;
    }
    const defaultIndex = Number(BigInt(userId) >> 22n) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
}
