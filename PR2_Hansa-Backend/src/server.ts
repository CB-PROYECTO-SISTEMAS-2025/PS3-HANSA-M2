/* eslint-disable prettier/prettier */
// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import { connectMongo, disconnectMongo,getDb } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import app from "./app";

async function bootstrap() {
  try {
    await getDb();
    const PORT = env.PORT;
    const server = app.listen(PORT, () => logger.info(` Server listening on port ${PORT}`));

    // Cierre ordenado
    const shutdown = async (signal: string) => {
      try {
        logger.warn(` Received ${signal}, shutting down...`);
        server.close(async () => {
          await disconnectMongo();
          logger.info("MongoDB disconnected");
          process.exit(0);
        });
      } catch (e) {
        logger.error(e);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception", err);
      shutdown("uncaughtException");
    });
    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection", reason);
      shutdown("unhandledRejection");
    });
  } catch (err) {
    logger.error("❌ Fatal error on bootstrap", err);
    process.exit(1);
  }
}

bootstrap();
