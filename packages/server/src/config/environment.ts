import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod/v4";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DISCORD_CLIENT_ID: z.string().min(1, "DISCORD_CLIENT_ID is required"),
    DISCORD_CLIENT_SECRET: z.string().min(
        1,
        "DISCORD_CLIENT_SECRET is required"
    ),
    DISCORD_CALLBACK_URL: z.url("DISCORD_CALLBACK_URL must be a valid URL"),
    DISCORD_GUILD_IDS: z
        .string()
        .min(1, "DISCORD_GUILD_IDS is required")
        .transform((val) => val.split(",").map((id) => id.trim())),
    FRONTEND_URL: z.url("FRONTEND_URL must be a valid URL"),
    NEXON_API_KEY: z.string().min(1, "NEXON_API_KEY is required")
});

export type Environment = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment variables:");
    console.error(z.prettifyError(result.error));
    process.exit(1);
}

export const env = result.data;
