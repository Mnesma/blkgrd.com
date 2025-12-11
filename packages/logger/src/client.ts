import dgram from "node:dgram";
import { type LogLevel, type LogMessage } from "./types.js";

export type { LogLevel, LogMessage };

type LogData = Record<string, unknown>;

type LoggerOptions = {
    service: string;
    host?: string;
    port?: number;
    fallbackToConsole?: boolean;
};

export class Logger {
    private readonly service: string;
    private readonly host: string;
    private readonly port: number;
    private readonly fallbackToConsole: boolean;
    private readonly socket: dgram.Socket;
    private defaultData: LogData = {};

    constructor(options: LoggerOptions) {
        this.service = options.service;
        this.host = options.host ?? process.env.LOG_HOST ?? "127.0.0.1";
        this.port = options.port
            ?? parseInt(process.env.LOG_PORT ?? "9514", 10);
        this.fallbackToConsole = options.fallbackToConsole ?? true;
        this.socket = dgram.createSocket("udp4");
    }

    private send(level: LogLevel, message: string, data?: LogData): void {
        const logMessage: LogMessage = {
            level,
            service: this.service,
            message,
            timestamp: Date.now(),
            data: { ...this.defaultData, ...data }
        };

        const buffer = Buffer.from(JSON.stringify(logMessage));

        this.socket.send(buffer, this.port, this.host, (error) => {
            if (error && this.fallbackToConsole) {
                console[level === "fatal" ? "error" : level](
                    `[${this.service}] ${message}`,
                    data ?? ""
                );
            }
        });
    }

    trace(message: string, data?: LogData): void {
        this.send("trace", message, data);
    }

    debug(message: string, data?: LogData): void {
        this.send("debug", message, data);
    }

    info(message: string, data?: LogData): void {
        this.send("info", message, data);
    }

    warn(message: string, data?: LogData): void {
        this.send("warn", message, data);
    }

    error(message: string, data?: LogData): void {
        this.send("error", message, data);
    }

    fatal(message: string, data?: LogData): void {
        this.send("fatal", message, data);
    }

    child(childData: LogData): Logger {
        const childLogger = new Logger({
            service: this.service,
            host: this.host,
            port: this.port,
            fallbackToConsole: this.fallbackToConsole
        });
        childLogger.defaultData = { ...this.defaultData, ...childData };
        return childLogger;
    }

    close(): void {
        this.socket.close();
    }
}
