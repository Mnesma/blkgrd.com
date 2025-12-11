import dotenv from "dotenv";
import dgram from "node:dgram";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pino from "pino";
import { LogMessageSchema } from "./types.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const LOG_DIR = process.env.LOG_DIR ?? join(process.cwd(), "logs");
const MINIMUM_LOG_LEVEL = process.env.MINIMUM_LOG_LEVEL ?? "trace";
const PORT = parseInt(process.env.LOG_PORT ?? "9514", 10);
const HOST = process.env.LOG_HOST ?? "127.0.0.1";

function createRollingLogger(filename: string) {
    return pino({
        level: MINIMUM_LOG_LEVEL,
        transport: {
            target: "pino-roll",
            options: {
                file: join(LOG_DIR, filename),
                frequency: "daily",
                limit: { count: 7 },
                mkdir: true
            }
        }
    });
}

const appLogger = createRollingLogger("app");
const internalLogger = createRollingLogger("internal");

const server = dgram.createSocket("udp4");

server.on("error", (error) => {
    internalLogger.error({ error: error.message }, "Logger server error");
    server.close();
});

server.on("message", (message) => {
    try {
        const parsed = JSON.parse(message.toString());
        const result = LogMessageSchema.safeParse(parsed);

        if (!result.success) {
            internalLogger.error(
                { error: result.error.message },
                "Invalid log message"
            );
            return;
        }

        const { level, service, message: logMessage, timestamp, data } =
            result.data;

        appLogger[level]({
            service,
            time: timestamp,
            ...data
        }, logMessage);
    } catch (error) {
        internalLogger.error(
            { error: String(error) },
            "Failed to parse log message"
        );
    }
});

server.on("listening", () => {
    const address = server.address();
    internalLogger.info(
        { host: address.address, port: address.port, logDir: LOG_DIR },
        "Logger service started"
    );
    console.log(
        `Logger service listening on ${address.address}:${address.port}`
    );
    console.log(`Writing logs to: ${LOG_DIR}`);
});

server.bind(PORT, HOST);

process.on("SIGINT", () => {
    internalLogger.info("Shutting down logger service");
    console.log("\nShutting down logger service...");
    server.close(() => {
        process.exit(0);
    });
});
