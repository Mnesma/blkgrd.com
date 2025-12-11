import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authRouter } from "./auth/routes.js";
import { sessionMiddleware } from "./auth/session.js";
import { mapleRankingRouter } from "./maplestory-ranking/routes.js";
import { env } from "./config/environment.js";
import { disconnectDatabase } from "./db/client.js";
import { createContext } from "./graphql/context.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/schema.js";
import { logger } from "./logger.js";

async function main() {
    console.log("[DEBUG] Starting server...");

    const app = express();
    console.log("[DEBUG] Express app created");

    app.use(
        cors({
            origin: env.FRONTEND_URL,
            credentials: true
        })
    );
    console.log("[DEBUG] CORS configured for:", env.FRONTEND_URL);

    app.use(sessionMiddleware);
    console.log("[DEBUG] Session middleware attached");

    app.use("/auth", authRouter);
    console.log("[DEBUG] Auth routes mounted at /auth");

    app.use(express.json());
    app.use("/maple-ranking", mapleRankingRouter);
    console.log("[DEBUG] MapleStory ranking routes mounted at /maple-ranking");

    const httpServer = http.createServer(app);
    console.log("[DEBUG] HTTP server created");

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    console.log("[DEBUG] Apollo Server created");

    await apolloServer.start();
    console.log("[DEBUG] Apollo Server started");

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: createContext
        })
    );
    console.log("[DEBUG] GraphQL middleware mounted at /graphql");

    app.get("/health", (_req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    console.log("[DEBUG] Health route registered");

    // const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // const frontendPath = path.resolve(__dirname, "../../frontend/dist");
    // console.log("[DEBUG] Frontend path:", frontendPath);

    // app.use(express.static(frontendPath));
    // console.log("[DEBUG] Static file serving configured");

    // app.get("*", (_req, res) => {
    //     res.sendFile(path.join(frontendPath, "index.html"));
    // });
    // console.log("[DEBUG] SPA catch-all route registered");

    app.listen(env.PORT, () => {
        logger.info(`Server ready at http://localhost:${env.PORT}`, {
            port: env.PORT
        });
        console.log(`[DEBUG] Server ready at http://localhost:${env.PORT}`);
    });

    process.on("SIGINT", async () => {
        logger.info("Shutting down...");
        console.log("\nShutting down server...");
        await apolloServer.stop();
        await disconnectDatabase();
        logger.close();
        process.exit(0);
    });
}

main().catch((error) => {
    logger.fatal("Failed to start server", { error: String(error) });
    process.exit(1);
});
