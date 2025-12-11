import { Logger } from "@blkgrd/logger";

export const logger = new Logger({
    service: "server",
    fallbackToConsole: true
});

