import { z } from "zod";

export const LogLevel = z.enum([
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
]);

export type LogLevel = z.infer<typeof LogLevel>;

export const LogMessageSchema = z.object({
    level: LogLevel,
    service: z.string(),
    message: z.string(),
    timestamp: z.number(),
    data: z.record(z.string(), z.unknown()).optional()
});

export type LogMessage = z.infer<typeof LogMessageSchema>;
